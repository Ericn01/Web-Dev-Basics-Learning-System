export const useProgress = () => {
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    const fetchProgress = async () => {
      try {
        const response = await api.get('/user/progress');
        setProgress(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
  
    const updateProgress = async (progressData) => {
      try {
        await api.post('/user/progress', progressData);
        await fetchProgress();
      } catch (err) {
        throw err;
      }
    };
  
    useEffect(() => {
      fetchProgress();
    }, []);
  
    return { progress, loading, error, updateProgress };
  };