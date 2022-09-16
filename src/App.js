import "./styles.css";
import axios from "axios";

async function compCodingScoreGen(userName, siteName) {
  const HIGHEST_CODECHEF_RANK = 4093;
  const HIGHEST_CODEFORCES_RANK = 3851;
  const genUrl = `https://competitive-coding-api.herokuapp.com/api/${siteName}/${userName}`;
  console.log(genUrl);
  let res = null;
  try {
    res = await axios.get(genUrl);
  } catch (e) {
    return "INVALID";
  }
  if (res.data.status !== "Success") {
    return "INVALID";
  }
  switch (siteName) {
    case "codeforces":
      if (res.data.rating === "Unrated") return 0;
      else return (res.data.rating / HIGHEST_CODEFORCES_RANK) * 5;
    case "codechef":
      return (res.data.rating / HIGHEST_CODECHEF_RANK) * 5;
    case "leetcode":
      return (
        (Number.parseInt(res.data.acceptance_rate.replace("%", "")) / 100) * 5
      );
  }
}

async function calcAvgRating(user) {
  let totalCount = 0;
  let validCount = 0;
  let totalRating = 0;
  for (let siteName in user) {
    const result = await compCodingScoreGen(user[siteName], siteName);
    if (result !== 0 && result !== "INVALID") {
      validCount += 1;
      totalRating += result;
    }
    totalCount += 1;
  }

  let avgRating = totalRating / validCount;
  let avgParticipation = (validCount / totalCount) * 5;

  return avgParticipation + avgRating;
}

const userInfo = {
  user1: {
    codeforces: "spycheese",
    codechef: "spycheese",
    leetcode: "yesterzeal"
  },
  user2: {
    codeforces: "yesterzeal",
    codechef: "yesterzeal",
    leetcode: "yesterzeal"
  }
};

// console.log(resp.data);

async function getScores() {
  for (let user in userInfo) {
    let result = await calcAvgRating(userInfo[user]);
    console.log(result);
  }
}
getScores();

export default function App() {
  return (
    <div className="App">
      <h1>Codechef, Leetcode and Codeforces score generator</h1>
      <h2>
        this sand box generate candidate score from 3 popular site codechef,
        leetcode and codeforces{" "}
      </h2>
      <h3>check console for scores</h3>
    </div>
  );
}
