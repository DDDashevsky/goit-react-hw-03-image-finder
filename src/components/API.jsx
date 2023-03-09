import axios from 'axios';
const KEY = '16191632-24b25e12a8d3e8a37fcf33b11';

axios.defaults.baseURL = 'https://pixabay.com/api/';

const fetchAPI = async (query, page) => {
  const res = await axios.get(
    `?q=${query}&page=${page}&key=${KEY}&image_type=photo&orientation=horizontal&per_page=12`
  );
  return res.data;
};

export default fetchAPI;
