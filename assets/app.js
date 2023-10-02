const client = ZAFClient.init();
client.invoke("resize", { width: "100%", height: "396px" });

const button = document.getElementById("bigButton");
const nickButton = document.getElementById("nickNameButton");

const token = "hidden";
const api = "hidden";

function currentTimeInSeconds() {
  return Math.floor(Date.now() / 1000);
}
console.log(`The time is ${currentTimeInSeconds()}`);

//deactivation button code below//

button.addEventListener("click", async () => {
  if (document.getElementById("userEmail").value != "") {
    const error = () => {
      document.getElementById("userEmail").value = "";
      document.getElementById("userEmail").placeholder =
        "Couldn't find account :(";
    };

    const optionsGet = {
      url: `https://api.hidden.com/users?email=${document
        .getElementById("userEmail")
        .value.toLowerCase()}`,
      type: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      dataType: "json",
    };

    const response = await client.request(optionsGet);

    try {
      const updated = () => {
        document.getElementById("userEmail").value = "";
        document.getElementById(
          "userEmail"
        ).placeholder = `Deactivated ${response.payload[0].nickname}`;
      };
      client.invoke("resize", { width: "100%", height: "350px" });
      const newDiv = document.createElement("div");
      const newContent = document.createTextNode(
        `https://api.hidden.com/#/users/${response.payload[0].id}`
      );
      newDiv.appendChild(newContent);
      const currentDiv = document.getElementById("div1");
      document.body.insertBefore(newDiv, currentDiv);

      const id = response.payload[0].id;

      const optionsPut = {
        url: `https://hidden/users/${id}`,
        type: "PUT",
        headers: {
          Accept: "*/*",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive",
          accept: "application/json",
          "accept-language": "en-US,en;q=0.9",
          Authorization: `Bearer ${token}`,
          authority: "api.hidden.com",
          "content-type": "application/json;charset=UTF-8",
        },
        contentType: "application/json",
        dataType: "text",
        data: JSON.stringify({
          registration_status: "deactivated",
        }),
      };

      const put = await client.request(optionsPut);
      updated();
    } catch (err) {
      error();
    }
  } else {
    document.getElementById("userEmail").placeholder = "Field cannot be blank";
  }
}),
  ///Release about button below//

  nickButton.addEventListener("click", async () => {
    const optionsPutIncomplete = {
      type: "PUT",
      headers: {
        Accept: "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        accept: "application/json",
        "accept-language": "en-US,en;q=0.9",
        Authorization: `Bearer ${token}`,
        authority: "api.hidden.com",
        "content-type": "application/json;charset=UTF-8",
      },
      contentType: "application/json",
      dataType: "text",
    };

    if (document.getElementById("userNickname").value != "") {
      const error = () => {
        document.getElementById("userNickname").value = "";
        document.getElementById("userNickname").placeholder =
          "Couldn't find account :(";
      };

      const optionsGet = {
        url: `https://hidden.com/nicknames/${
          document.getElementById("userNickname").value
        }`,
        type: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        dataType: "json",
      };

      try {
        const response = await client.request(optionsGet);

        try {
          const updated = () => {
            document.getElementById("userNickname").value = "";
            document.getElementById("userNickname").placeholder = "Success";
          };

          const id = response.payload.id;

          const optionsPut = {
            url: `https://hidden.api.com/users/${id}`,
            type: "PUT",
            headers: {
              Accept: "*/*",
              "Accept-Encoding": "gzip, deflate, br",
              Connection: "keep-alive",
              accept: "application/json",
              "accept-language": "en-US,en;q=0.9",
              Authorization: `Bearer ${token}`,
              authority: "api.hidden.com",
              "content-type": "application/json;charset=UTF-8",
            },
            contentType: "application/json",
            dataType: "text",
            data: JSON.stringify({
              about: "",
            }),
          };

          const put = await client.request(optionsPut);
          updated();
        } catch (err) {
          error();
        }
      } catch {
        error();
      }
    } else {
      document.getElementById("userNickname").placeholder =
        "Field cannot be blank";
    }
  });

//release nickname button below//

const sendPutRequest = async (url, options) => {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getRandomNumber = () => Math.floor(Math.random() * 5) + 1;

const generateNewNickname = (sharedName) => {
  const randomNumber = getRandomNumber();
  const prefix = `randNum${randomNumber}`;
  return `${prefix}${sharedName.nickname}`;
};

// function to check if match was played more than 2 years ago
const isMatchPlayedMoreThanTwoYearsAgo = (gameFinishTime) => {
  const currentTimeInSeconds = Math.floor(Date.now() / 1000);
  return (
    gameFinishTime === undefined ||
    currentTimeInSeconds - gameFinishTime > 63072000
  );
};

// function to check if match was played less than 2 years ago
const isMatchPlayedLessThanTwoYearsAgo = (gameFinishTime) => {
  const currentTimeInSeconds = Math.floor(Date.now() / 1000);
  return (
    gameFinishTime !== undefined &&
    currentTimeInSeconds - gameFinishTime < 63072000
  );
};

//  function to check if name can be released
const canReleaseName = (gameFinishTime) => {
  return (
    gameFinishTime === undefined ||
    isMatchPlayedMoreThanTwoYearsAgo(gameFinishTime)
  );
};

// function to handle search button click
const handleSearchButtonClick = async () => {
  const releaseNickname = document.getElementById("releaseNickname");
  const searchQuery = releaseNickname.value;

  const searchUrl = `https://api.hidden.com/search/pagination.limit=30&query=${searchQuery}&Authorization=Bearer ${apiKey}`;

  try {
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    const userSearch = searchData.payload.results;

    const regex = new RegExp(`${searchQuery}`, "i");

    const sharedNames = userSearch.filter(({ nickname }) => {
      return nickname.length === searchQuery.length && nickname.match(regex);
    });

    for (let sharedName of sharedNames) {
      const numOfGames = sharedName.games.length;

      if (numOfGames !== 0 && sharedName.nickname.length < 12) {
        for (let game of sharedName.games) {
          const gameUrl = `https://open.faceit.com/data/v4/players/${sharedName.id}/history?game=${game.name}&from=24&offset=0&limit=1`;

          const optionsPutData = {
            method: "PUT",
            headers: {
              Accept: "*/*",
              "Accept-Encoding": "gzip, deflate, br",
              Connection: "keep-alive",
              accept: "application/json",
              "accept-language": "en-US,en;q=0.9",
              Authorization: `Bearer ${token}`,
              authority: "hidden.com",
              "content-type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify({
              nickname: generateNewNickname(sharedName),
              registration_status: "deactivated",
            }),
          };

          const gameResponse = await sendPutRequest(gameUrl, optionsPutData);
          console.log(gameResponse);
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
};
