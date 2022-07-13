// const {Builder} = require('selenium-webdriver');
const {Builder, By, Key, until} = require('selenium-webdriver');

const chrome = require('selenium-webdriver/chrome');

// const service = new chrome.ServiceBuilder('/path/to/chromedriver');
// const driver = new Builder().forBrowser('chrome').setChromeService(service).build();

(async function helloSelenium() {
    // let driver = await new Builder().forBrowser('chrome').build();
    const service = new chrome.ServiceBuilder('/path/to/chromedriver');
    const driver = new Builder().forBrowser('chrome').setChromeService(service).build();

    
    await driver.get('https://www.google.com');

    await driver.getTitle(); // => "Google"

    driver.manage().setTimeouts({implicit: 0.5 })

    let searchBox = await driver.findElement(By.name('q'));
    let searchButton = await driver.findElement(By.name('btnK'));

    await searchBox.sendKeys('Selenium');
    await searchButton.click();

    await driver.findElement(By.name('q')).getAttribute("value"); // => 'Selenium'

    await driver.quit();
})();

