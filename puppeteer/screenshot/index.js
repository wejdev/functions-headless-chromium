const puppeteer = require('puppeteer');

module.exports = async function (context, req) {
    const headerTemplate = `<span></span>`;

    const footerTemplate = `
        <html>
            <head>
                <style type="text/css">
                    #footer {
                    padding: 0;
                    }
                    .content-footer {
                    width: 100%;
                    background-color: brown;
                    color: white;
                    padding: 5px;
                    print-color-adjust: exact;
                    -webkit-print-color-adjust: exact;
                    vertical-align: middle;
                    font-size: 10pt;
                    margin-top: 0;
                    display: inline-block;
                    text-align: center;
                    }
                </style>
            </head>
            <body>
                <div class="content-footer">
                    Page <span class="pageNumber" style="background-color: hotpink"></span> of <span class="totalPages" style="background-color: lime"></span>
                </div>
            </body>
        </html>
    `;

    const url = req.query.url || 'https://eso.com/';
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, {
        waitUntil: 'load',
        timeout: 0
    });

    const screenshotBuffer = await page.pdf({
        // fullPage: true,
        displayHeaderFooter: true,
        // headerTemplate: headerTemplate,
        footerTemplate: footerTemplate,
        format: 'letter',
        margin: {
            top: '60px',
            bottom: '60px'
        },
        printBackground: true
    });
    await browser.close();

    context.res = {
        body: screenshotBuffer,
        headers: {
            'content-type': 'application/pdf'
        }
    };
};
