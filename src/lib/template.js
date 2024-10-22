const config = require('../config');
const fs = require('fs');
const path = require('path');

function makeHtmlTemplate(htmlBody) {
    return `
    <!DOCTYPE HTML>
    <HTML>
        <HEAD>
            <meta charset="utf-8">
        </HEAD>
        <BODY>
            ${htmlBody}
        </BODY>
    </HTML>
    `;
}

function makeHtmlPostList() {
    let htmlPostList = '<ul>';
    const files = fs.readdirSync(config.dataDir);
    files.forEach((filepath) => {
        let postId = path.parse(filepath).name;
        htmlPostList += '<li>';
        htmlPostList += 
            `<a href="/?id=${postId}">${path.parse(filepath).name}</a>`;
        htmlPostList += '</li>';
    });
    htmlPostList += '</ul>';

    return htmlPostList;
}

module.exports = {
    root: (id) => {
        let htmlContent = '<h2>Welcome to My Node.js Web App</h2>';
        let controller = '<a href="/create">Create</a><br>'

        if (id !== undefined) {
            htmlContent += '<p>';
            const postPath = `${config.dataDir}/${id}.txt`;
            if (fs.existsSync(postPath)) {
                var postDesc = fs.readFileSync(postPath, 'utf-8');
                htmlContent += postDesc;
                controller += `<a href="/update?id=${id}">Update</a>`;
                controller += this.delete(id);
            }
            else
                htmlContent += 'No post was found.';
            
            htmlContent += '</p>';
        }
        return makeHtmlTemplate(`
        <p>${htmlContent}</p>
        <h3>Posts</h3>
        <p>${makeHtmlPostList()}</p>
        <p>${controller}</p>
        `);
    },
    create: () => {
        return makeHtmlTemplate(`
        <form action="http://localhost:${config.port}/create_process" 
        method="post">
            <p><input type="text" id="title" name="title" placeholder="Title">
            </p>
            <p><textarea id="desc" name="desc" 
                placeholder="Description"></textarea>
            </p>
            <p><input type="submit"></p>
        </form>
        `);
    },
    update: (id) => {
        const postPath = `${config.dataDir}/${id}.txt`;
        const postDesc = fs.readFileSync(postPath, 'utf-8');
        return makeHtmlTemplate(`
        <form action="http://localhost:${config.port}/update_process" 
        method="post">
            <p>
            <input type="text" id="title" name="title" placeholder="Title",
             value="${id}" readonly>
            </p>
            <p><textarea id="desc" name="desc" 
                placeholder="Description">${postDesc}</textarea>
            </p>
            <p><input type="submit"></p>
        </form>
        `);
    },
    delete: (id) => {
        return `
        <form action="http://localhost:${config.port}/delete_process"
        method="post">
            <input type="hidden" id="id" name="id" value="${id}">
            <input type="submit" value="Delete">
        </form>
        `;
    }
};