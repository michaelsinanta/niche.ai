import axios from "axios";

const BASE_URL = "https://opentdb.com/api.php";
const TOKEN_URL = "https://opentdb.com/api_token.php";

export const fetchToken = async () => {
  const response = await axios.get(`${TOKEN_URL}?command=request`);
  return response.data.token;
};

export const fetchQuestions = async (token: string, amount = 10) => {
  const response = await axios.get(
    `${BASE_URL}?amount=${amount}&token=${token}`,
  );
  return response.data;
};
