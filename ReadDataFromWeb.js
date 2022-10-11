const puppeteer = require("puppeteer");
const fs = require("fs");

const path = "blsFinal.txt";
const url = "https://argosweb.tcbuen.com/Account/Login.aspx";
const USER = "XXXXXX";
const PASS = "XXXXXX";
var resultFinal = [];

const BLs = ["XXXXXXXX", "XXXXXXXXX"];

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    ignoreDefaultArgs: ["--disable-extensions"],
    args: ["–start-fullscreen"],
  });
  //Go to URL
  let page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "networkidle0",
  });
  //Input User
  await page.type(
    "#ctl00_ctl00_ASPxSplitter1_Content_MainContent_tbUserName_ET",
    USER,
    { delay: 100 }
  );
  //Input Pass
  await page.type(
    "td.dxic #ctl00_ctl00_ASPxSplitter1_Content_MainContent_tbPassword_I_CLND",
    PASS,
    { delay: 100 }
  );
  //Clic Login
  await page.click(
    "div.dxbButton_Metropolis.login.login-submit.dxbButtonSys.dxbTSys"
  );
  // Go TO Page for BLs
  await page.goto("https://argosweb.tcbuen.com/ConsultaBLCOS.aspx", {
    waitUntil: "networkidle0",
  });

  //FOR EACH BLs
  for (let i = 0; i < BLs.length; i++) {
    //Clic on search button if reload doestn´t work in order to clean
    await page.click("#ctl00_ASPxSplitter1_Content_ctl00_ASPxTxtBL_I", {
      waitUntil: "networkidle0",
      clickCount: 3,
    });
    // Writte BL
    await page.type("#ctl00_ASPxSplitter1_Content_ctl00_ASPxTxtBL_I", BLs[i], {
      delay: 35,
      waitUntil: "networkidle0",
    });
    //Clic on search button
    await page.click(
      "div #ctl00_ASPxSplitter1_Content_ctl00_ASPxButtonBuscar_CD.dxb",
      {
        waitUntil: "networkidle0",
      }
    );
    //Wait for page load the page with new info
    await page.waitForNavigation({
      waitUntil: "networkidle0",
    });

    //Read data of BLs testContent or innerHTML
    const result = await page
      .evaluate(
        () => {
          return Array.from(document.querySelectorAll("td.dx-wrap.dxgv")).map(
            (el) => el.textContent
          );
        },
        { waitUntil: "networkidle0" }
      )
      .catch((err) => console.log("error loading url", err));

    //Loop the new array in order to extract only the datatext
    await result.forEach((element) => {
      resultFinal.push({
        Item: i + 1,
        "BL buscado": BLs[i],
        data: element.toString().trim(),
      });
    });

    //ScreenShoot
    await page.screenshot({
      path: `BLS\/${BLs[i]}.png`,
    });

    //console.log(resultFinal);
    fs.writeFile(path, JSON.stringify(resultFinal), "utf8", function (err) {
      if (err) {
        return console.log(err);
      }
      console.log(`The bl No ${i} was saved!`);
    });

    //Reload page to clean
    //await page.reload();
  }
  await browser.close();
})();
