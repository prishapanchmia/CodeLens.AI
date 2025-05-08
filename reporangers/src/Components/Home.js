import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = ({setData}) => {
  const [contractAddress, setContractAddress] = useState('');
  const [githubRepo, setGithubRepo] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/analyze-repo?repo_url=${encodeURIComponent(githubRepo)}`
      );
      if (!response.ok) {
        throw new Error("Analysis failed");
      }


      const data = await response.json();
      setData({
        // contractAddress,
        githubRepo,
        analysisData: data
      });
      navigate('/statistics')

      // navigate('/statistics', {
      //   state: {
      //     contractAddress,
      //     githubRepo,
      //     analysisData: data,
      //   },
      // });
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '3rem', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: 'auto' }}>
      <p style={{ fontStyle: 'italic', textAlign: 'center', marginBottom: '2rem' }}>
        PROVIDE THE GITHUB REPO LINK 
        <br />
        (EG: HTTPS://GITHUB.COM/USERNAME/REPONAME). 
        <br />
        THIS MAY TAKE A MOMENT TO ANALYZE THE CODE, UPDATE THE DATABASE, GENERATE VISUALS AND ASSIGN A TRUST INDEX SCORE. 
        <br />
        LET’S DIG INTO THE DATA.
      </p>

      <form onSubmit={handleSubmit}>
        {/* <label style={{ display: 'block', marginBottom: '0.5rem' }}>CA</label>
        <input
          type="text"
          placeholder="Enter the token address"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            marginBottom: '1.5rem',
            border: '1px solid #000',
            borderRadius: '5px'
          }}
        /> */}

        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Github Repo</label>
        <input
          type="text"
          placeholder="Enter the Github repo"
          value={githubRepo}
          onChange={(e) => setGithubRepo(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            marginBottom: '2rem',
            border: '1px solid #000',
            borderRadius: '5px'
          }}
        />

        <button type="submit" disabled={loading} style={{
          padding: '0.75rem 1.5rem',
          border: 'none',
          borderRadius: '5px',
          backgroundColor: loading ? '#555' : '#000',
          color: '#fff',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}>
          {loading ? 'Analyzing...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default Home;
