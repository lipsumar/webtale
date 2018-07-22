var handlebars = require('handlebars'),
    layouts = require('handlebars-layouts'),
    fs = require('fs'),
    path = require('path'),
    dir = require('node-dir'),
    util = require('util'),
    events = require('events'),
    frontMatter = require('front-matter'),
    async = require('async');
handlebars.registerHelper(layouts(handlebars));





var options;

function PageBuilder(){
    events.EventEmitter.call(this);
}
util.inherits(PageBuilder, events.EventEmitter);

PageBuilder.prototype.init = function(opts, cb) {
    options = opts;
    this.layouts = {};
    registerHelpers.call(this);
    registerPartials();
    async.parallel([
        registerUserPartials.bind(this, path.join(options.from, '_layouts')),
        registerUserPartials.bind(this, path.join(options.from, '_partials')),
        loadMobileContentPage.bind(this)
    ], cb);

}

PageBuilder.prototype.build = function(content){
    var {body,vars} = this.toHandlebars(content);
    var tpl = handlebars.compile(body);
    var html = tpl(Object.assign({
        base_url: options.base_url
    }, vars));
    return html;
}

PageBuilder.prototype.toHandlebars = function(str) {
    var front = frontMatter(str),
        vars = front.attributes,
        body = front.body,
        mainBlock = 'body';

    if (!vars.mobile_content) {
        vars.mobile_content = this.mobileContent
    }

    if(vars.layout){

        if(this.layouts[vars.layout]){
            mainBlock = this.layouts[vars.layout].mainBlock || mainBlock;
        }

        body = `{{#extend "${vars.layout}"}}\n{{#content "${mainBlock}"}}\n${body}\n{{/content}}\n{{/extend}}`;
    }

    return {body, vars};
}

function loadMobileContentPage (cb) {
    this.mobileContent = fs.readFileSync(path.join(options.from, 'mobile_content.html')).toString()
    cb()
}


function registerHelpers(){
    var self = this;
    handlebars.registerHelper('link', toPath => {
        var toFile = path.join(options.from, toPath + '.html')
        if(!fs.existsSync(toFile)){
            throw new Error(`Link to "${toPath}" but file ${toFile} doesn’t exist`);
        }
        self.emit('link', toPath);
        return options.base_url + toPath + '.html';
    })
}
function registerPartials(){
    handlebars.registerPartial('html', getFile('../layouts/html.html'));
    handlebars.registerPartial('email_address_form', getFile('../partials/email_address_form.html'));
}

function registerUserPartials(from, done){
    dir.readFiles(from, (err, content, filename, cb) => {
        var name = path.basename(filename, '.html');
        var front = frontMatter(content);
        if(front.attributes.mainBlock){
            this.layouts[name] = front.attributes;
        }
        var hbsContent = this.toHandlebars(content);
        handlebars.registerPartial(name, hbsContent.body);
        cb();
    }, done);
}

function getFile(f){
    return fs.readFileSync(path.join(__dirname, f)).toString();
}


module.exports = new PageBuilder();
