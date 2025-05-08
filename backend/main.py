# core.py
import warnings
import sys
import uvicorn
from urllib.parse import urlparse
import requests
import firebase_admin
from firebase_admin import credentials, firestore
from langchain.prompts import ChatPromptTemplate
from langchain_cohere.chat_models import ChatCohere
from itertools import cycle
import time
import re
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langchain.docstore.document import Document
from bs4 import BeautifulSoup
from langchain_community.embeddings import CohereEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter

# Add these lines at the top of your file, before any database operations
# __import__('pysqlite3')
# sys.modules['sqlite3'] = sys.modules.pop('pysqlite3')

warnings.filterwarnings("ignore")

service_account = {
  "type": "service_account",
  "project_id": "csci577a",
  "private_key_id": "",
  "private_key": "",
  "client_email": "firebase-adminsdk-fbsvc@csci577a.iam.gserviceaccount.com",
  "token_uri": "https://oauth2.googleapis.com/token",
}

if not firebase_admin._apps:
    cred = credentials.Certificate(service_account)
    firebase_admin.initialize_app(cred, {
        'databaseURL': ""
    })
db = firestore.client()

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    # "https://yourdomain.com",
    # "https://api.yourdomain.com",
]

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
    expose_headers=["*"]  # Exposes all headers
)

# Firebase Setup
service_account = {
    # Your Firebase service account details here
}

if not firebase_admin._apps:
    cred = credentials.Certificate(service_account)
    firebase_admin.initialize_app(cred, {
        'databaseURL': "https://your-project-id.firebaseio.com"
    })
os.environ['LANGCHAIN_TRACING_V2'] = 'true'
os.environ['LANGCHAIN_ENDPOINT'] = 'https://api.smith.langchain.com'
os.environ['OPENAI_API_KEY'] = "<KEY_NAME>"
COHERE_API_KEY_1 = "<KEY_NAME>"
COHERE_API_KEY_2 = "<KEY_NAME>"
COHERE_API_KEY_3 = "<KEY_NAME>"
COHERE_API_KEY_4 = "<KEY_NAME>"
COHERE_API_KEY_5 = "<KEY_NAME>"
COHERE_API_KEY_6 = "<KEY_NAME>"
COHERE_API_KEY_7 = "<KEY_NAME>"
COHERE_API_KEY_8 = "<KEY_NAME>"
COHERE_API_KEY_9 = "<KEY_NAME>"
COHERE_API_KEY_10 = "<KEY_NAME>"
COHERE_API_KEY_11 = "<KEY_NAME>"
COHERE_API_KEY_12 = "<KEY_NAME>"
COHERE_API_KEY_13 = "<KEY_NAME>"
COHERE_API_KEY_14 = "<KEY_NAME>"
COHERE_API_KEY_15 = "<KEY_NAME>"
COHERE_API_KEY_16 = "<KEY_NAME>"
COHERE_API_KEY_17 = "<KEY_NAME>"
COHERE_API_KEY_18 = "<KEY_NAME>"
COHERE_API_KEY_19 = "<KEY_NAME>"
COHERE_API_KEY_20 = "<KEY_NAME>"
COHERE_API_KEY_21 = "<KEY_NAME>"
COHERE_API_KEY_22 = "<KEY_NAME>"
COHERE_API_KEY_23 = "<KEY_NAME>"
COHERE_API_KEY_24 = "<KEY_NAME>"
COHERE_API_KEY_25 = "<KEY_NAME>"

COHERE_API_KEYS = [
    COHERE_API_KEY_1, COHERE_API_KEY_2, COHERE_API_KEY_3, COHERE_API_KEY_4,
    COHERE_API_KEY_5, COHERE_API_KEY_6, COHERE_API_KEY_7, COHERE_API_KEY_8,
    COHERE_API_KEY_9, COHERE_API_KEY_10, COHERE_API_KEY_11, COHERE_API_KEY_12,
    COHERE_API_KEY_13, COHERE_API_KEY_14, COHERE_API_KEY_15, COHERE_API_KEY_16,
    COHERE_API_KEY_17, COHERE_API_KEY_18, COHERE_API_KEY_19, COHERE_API_KEY_20,
    COHERE_API_KEY_21, COHERE_API_KEY_22, COHERE_API_KEY_23, COHERE_API_KEY_24,
    COHERE_API_KEY_25
]
key_cycle = cycle(COHERE_API_KEYS)

# GitHub API Token (use environment variable or replace directly)
GITHUB_TOKEN_1 = "KEY_NAME"
GITHUB_TOKEN_2 = "KEY_NAME"
HEADERS = {'Authorization': f'token {GITHUB_TOKEN_1}'}

# Extensions to Extract
EXTENSIONS = ['.py', '.ts', '.js', '.rs']

# Rate Limit Handling


def handle_rate_limit(response):
    if response.status_code == 403 and 'X-RateLimit-Remaining' in response.headers:
        reset_time = int(response.headers['X-RateLimit-Reset'])
        wait_time = reset_time - int(time.time()) + 1
        print(f"Rate limit exceeded. Waiting for {wait_time} seconds...")
        time.sleep(wait_time)

# Get Repository Contents


def get_repo_contents(owner, repo, path=""):
    url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}"
    response = requests.get(url, headers=HEADERS)

    if response.status_code == 403:
        handle_rate_limit(response)
        return get_repo_contents(owner, repo, path)
    return response.json() if response.status_code == 200 else []


# Prompt
template = """You are a code inspector, provide information for the code file given in the following manner:
"Summary: <summary of the file>"
"Scope of improvement": "<brief ONLY the necessary issues with the code and scope of improvement in bullet points with categories>"
"Verdict": <How sensible the code>


Code File:
{context}
"""

verdict_prompt = ChatPromptTemplate.from_template(template)

template = """You are an expert code reviewer and static analysis tool. Your task is to evaluate the following code and provide metrics based on best practices. Analyze the code based on the following criteria:

Code Complexity: Rate the cyclomatic complexity of the code from 1 (very simple) to 10 (very complex). 
Code Duplication: Rate the presence of repeated code patterns from 1 (no duplication) to 10 (high duplication).
Code Coverage: Hypothesize the test coverage based on the presence of testable logic and apparent test cases. Rate from 1 (no coverage) to 10 (excellent coverage).
Code Smells: Rate potential areas of concern in the code structure or logic from 1 (no smells) to 10 (many smells).
Vulnerabilities: Rate the likelihood of security issues in the code from 1 (secure) to 10 (very vulnerable).
Linting and Style Compliance: Rate adherence to standard code style and linting guidelines from 1 (non-compliant) to 10 (fully compliant).

Provide the evaluation of the provided code as per the specified metrics. Output only the criterion: numerical values for each criterion in the without any additional explanation or context as given above. Do not include anything else.

Python File:
{context}
"""

metric_prompt = ChatPromptTemplate.from_template(template)

summary_template = """Summarize the following project into a concise overview to an investor in HTML in non technical terms
1. purpose of the project,
2. key features of the project,
4. areas for improvement for the code,
5. final verdict

Code and Improvement:
{context}

<body>
"""
summary_prompt = ChatPromptTemplate.from_template(summary_template)

simplified_template = """"Simplify the following code file into a high-level description of the code:\n\n"
Code:
{code}

Provide a simplified explanation of the relationships and key elements.
"""
simplified_prompt = ChatPromptTemplate.from_template(simplified_template)

ans_template = """Your a chat bot called Sleuth. Explain the github repository based only on the simplified code and keep your answers short:
Simplified Code: 
{context}

Question: {question}
"""
ans_prompt = ChatPromptTemplate.from_template(ans_template)


def create_llm(api_key):
    """
    Creates a new instance of the ChatCohere LLM with the given API key.
    """
    return ChatCohere(model="command-r-plus", temperature=0, cohere_api_key=api_key)


def extract_body_html(html_content):
    """
    Extracts and returns the content within <body> tags in the same HTML format.

    Parameters:
        html_content (str): The HTML content as a string.

    Returns:
        str: The HTML content within <body> tags, or None if no <body> tag is present.
    """
    soup = BeautifulSoup(html_content, 'html.parser')  # Parse the HTML content
    body_content = soup.body  # Access the <body> tag
    return str(body_content)[7:-8] if body_content else None


def metrics_to_dict(metrics_text):
    """
    Converts metrics text into a dictionary.

    Args:
        metrics_text (str): A multiline string with metric names and values.

    Returns:
        dict: A dictionary containing the metric names as keys and their values as integers.
    """
    metrics_dict = {}
    for line in metrics_text.strip().split('\n'):
        if ":" in line:
            key, value = line.split(":", 1)
            metrics_dict[key.strip().lower().replace(" ", "_")
                         ] = int(value.strip())
    return metrics_dict


def extract_bullet_point_headings(text):
    """
    Extracts only the headings from bullet points in the given text.

    Args:
        text (str): The input text containing bullet points.

    Returns:
        list: A list of strings representing the bullet point headings.
    """
    # Regular expression to match bullet points and extract the heading before the colon
    bullet_point_pattern = r'^-\s*([^:]+):'
    headings = re.findall(bullet_point_pattern, text, re.MULTILINE)
    return headings


def parse_text_to_dict(text, metric, simplified_code, file_path):
    """
    Parses structured text into a dictionary with keys 'summary', 'scope of improvement', and 'score'.

    Args:
        text (str): The input text to parse.

    Returns:
        dict: A dictionary with parsed keys and values.
    """
    # Define patterns for each section
    summary_pattern = r"Summary:(.*?)(?=Scope of Improvement:)"
    scope_pattern = r"Scope of Improvement:(.*?)(?=Verdict:)"
    verdict_pattern = r"Verdict:(.*?)(?=\n[A-Z][a-zA-Z ]*:|$)"

    # Extract matches
    summary_match = re.search(summary_pattern, text, re.DOTALL)
    scope_match = re.search(scope_pattern, text, re.DOTALL)
    verdict_match = re.search(verdict_pattern, text, re.DOTALL)

    # Process matches and clean up whitespace
    summary = summary_match.group(1).strip() if summary_match else ""
    scope = scope_match.group(1).strip() if scope_match else ""
    verdict = verdict_match.group(1).strip() if verdict_match else ""
    categories = extract_bullet_point_headings(scope)

    return {
        "file": file_path,
        "summary": summary,
        "scope_of_improvement": scope,
        "verdict": verdict,
        "categories": categories,
        "metric": metric,
        "simplified_code": simplified_code
    }

# Extract Files Based on Extensions


def extract_files(owner, repo, save_dir):
    # os.makedirs(save_dir, exist_ok=True)
    file_count = 20
    stack = get_repo_contents(owner, repo)
    file_list = []
    while stack and file_count > 0:
        item = stack.pop()
        if item['type'] == 'dir':
            stack.extend(get_repo_contents(owner, repo, item['path']))
        elif item['type'] == 'file' and any(item['name'].endswith(ext) for ext in EXTENSIONS):
            file_count -= 1
            file_url = item['download_url']

            # Fetch file content and print it
            response = requests.get(file_url)
            if response.status_code == 200:
                content = response.text
                loc = len(content.splitlines())

                verdict_reply = '''summary": "",\n"scope of improvement": "",\n"verdict": "",\n"score": '''

                metric = {
                    "Code Complexity": 0,
                    "Code Duplication": 0,
                    "Code Coverage": 0,
                    "Code Smells": 0,
                    "Vulnerabilities": 0,
                    "Linting and Style Compliance": 0
                }
                simplified_code = ""
                if loc != 0:
                    api_key = next(key_cycle)
                    verdict_llm = create_llm(api_key)
                    verdict_chain = verdict_prompt | verdict_llm
                    verdict_reply = verdict_chain.invoke(
                        {"context": content}).content

                    api_key = next(key_cycle)
                    metric_llm = create_llm(api_key)
                    metric_chain = metric_prompt | metric_llm
                    metric = metrics_to_dict(
                        metric_chain.invoke({"context": content}).content)

                    api_key = next(key_cycle)
                    llm = create_llm(api_key)
                    simplified_chain = simplified_prompt | llm
                    simplified_code = simplified_chain.invoke(
                        {"code": content}).content

                metric['loc'] = loc

                file_list.append(parse_text_to_dict(
                    verdict_reply, metric, simplified_code, (repo+"/"+item['path'])))
                print("\n")

            else:
                print(
                    f"Failed to fetch {item['path']}. HTTP Status code: {response.status_code}")
    return {
        "file_count": len(file_list),
        "files": file_list
    }


def get_existing_analysis(owner, repo):
    """Returns existing analysis from Firestore if available, else None."""
    prefix = f"{owner}___{repo}___"
    collection_name = "LOCAL_TEST_FILES"
    
    docs = db.collection(collection_name).stream()

    files = [
        {"id": doc.id, **doc.to_dict()}
        for doc in docs
        if doc.id.startswith(prefix)
    ]
    if files:
        return {
            "file_count": len(files),
            "files": files
        }
    return None

# Specify the directory containing the Python files
def main(repo_url):
    parsed_url = urlparse(repo_url)
    owner, repo = parsed_url.path.strip('/').split('/')[:2]
    existing_analysis = get_existing_analysis(owner, repo)
    if existing_analysis:
        print("Using cached analysis from Firestore.")
        analysis = existing_analysis
    else:
        print("No cache found. Analyzing the repository...")
        save_directory = f"{repo}_files"
        analysis = extract_files(owner, repo, save_directory)
    relevant_fields = [
        {
            "file": item["file"],
            "scope of improvement": item["scope_of_improvement"],
            "simplified_code": item["simplified_code"]
        }
        for item in analysis['files']
    ]
    api_key = next(key_cycle)
    llm = create_llm(api_key)
    summary_chain = summary_prompt | llm
    summary = summary_chain.invoke({"context": relevant_fields}).content
    html_summary = extract_body_html(summary)
    return html_summary, analysis


def extract_github_username(url):
    parsed_url = urlparse(url)
    path_parts = parsed_url.path.strip('/').split('/')

    if len(path_parts) > 0:
        return path_parts[0]
    else:
        return None

# Firebase Cloud Function to add analyzed code files to Firestore


async def add_code_analysis_to_firestore(analysis, repo_url, repo_summary):
    try:
        files = analysis['files']
        batch = db.batch()
        for file in files:
            username = extract_github_username(repo_url) or 'unknown_user'
            doc_id = username+"/"+file['file']
            doc_id = doc_id.replace("/", "___")
            doc_ref = db.collection(
                'LOCAL_TEST_FILES').document(document_id=doc_id)
            file['repo_url'] = repo_url
            file['repo_summary'] = repo_summary
            batch.set(doc_ref, file)
        batch.commit()
        print("Successfully added code analysis to Firestore.")
    except Exception as e:
        print(f"Error adding code analysis to Firestore: {e}")
        raise Exception("Failed to save analysis to Firestore")


def get_answer(file_content, query, doc_count):
    code_file = Document(page_content=file_content,
                         metadata={"source": "local"})

    # text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
    #     chunk_size=30,
    #     chunk_overlap=10)

    # splits = text_splitter.split_documents([code_file])

    # api_key = next(key_cycle)
    # cohere_embeddings = CohereEmbeddings(
    #     cohere_api_key=api_key,
    #     user_agent="langchain",
    #     model="embed-english-light-v3.0"
    # )

    # vectorstore = Chroma.from_documents(documents=splits,
    #                                     embedding=cohere_embeddings)

    # retriever = vectorstore.as_retriever()
    # retrieved_docs = retriever.get_relevant_documents(
    #     query, k=doc_count//2)

    api_key = next(key_cycle)
    llm = create_llm(api_key)
    ans_chain = ans_prompt | llm
    # Run
    reply = ans_chain.invoke(
        {"context": [[code_file]], "question": query}).content
    return reply

# API Endpoint


@app.get("/")
async def root():
    return {"message": "Chat file added!"}


@app.get("/analyze-repo")
async def analyze_repo(repo_url: str):
    try:
        repo_summary, analysis = main(repo_url=repo_url)
        print("Starting firebase operation...")
        await add_code_analysis_to_firestore(analysis, repo_url, repo_summary)
        return {"status": analysis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/chat-file")
async def analyze_repo(doc_id: str, query: str):
    try:
        doc_ref = db.collection('LOCAL_TEST_FILES').document(document_id=doc_id)

        file = doc_ref.get().to_dict()
        repo_url = file['repo_url']
        simplified_code = file['simplified_code']
        # Fetch documents matching the repo_url
        matching_docs = db.collection('LOCAL_TEST_FILES').where(
            'repo_url', '==', repo_url).get()

        # Count the documents
        doc_count = int(len(matching_docs))

        answer = get_answer(simplified_code, query, doc_count)
        
        # parsed_url = urlparse(repo_url)
        # path_parts = parsed_url.path.strip('/').split('/')

        # if len(path_parts) >= 2:
        #     username = path_parts[0]
        #     repo_name = path_parts[1]
            
        # # Create doc_id for REPO_REQUEST collection
        # request_doc_id = f"{username}___{repo_name}"

        # # Update status in REPO_REQUEST collection
        # repo_request_ref = db.collection(
        #     'LOCAL_TEST_FILES').document(request_doc_id)
        # repo_request_ref.update({'status': 'success'})
        
        return {"response": answer}
    except Exception as e:
        # parsed_url = urlparse(repo_url)
        # path_parts = parsed_url.path.strip('/').split('/')

        # if len(path_parts) >= 2:
        #     username = path_parts[0]
        #     repo_name = path_parts[1]

        # # Create doc_id for REPO_REQUEST collection
        # request_doc_id = f"{username}___{repo_name}"

        # # Update status in REPO_REQUEST collection
        # repo_request_ref = db.collection(
        #     'LOCAL_TEST_FILES').document(request_doc_id)
        # repo_request_ref.update({'status': 'failed'})

        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        timeout_keep_alive=900  # 900 seconds (15 minutes)
    )