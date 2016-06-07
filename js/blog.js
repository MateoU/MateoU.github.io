$(function () {
    var APPLICATION_ID = "D26A0086-F7E9-F507-FFED-0CC7A40B2F00",
        SECRET_KEY = "A51A4E4C-DA96-901B-FF15-31E130192E00",
        VERSION = "v1";
        
    Backendless.initApp(APPLICATION_ID, SECRET_KEY, VERSION);
    
    var postsCollection = Backendless.Persistence.of(Posts).find();
    
    console.log(postsCollection);
    
    var wrapper = {
        posts: postsCollection.data
    };
    
    Handlebars.registerHelper('format', function (time) {
        return moment(time).format("dddd, MMMM Do YYYY");
    });
    
    Handlebars.registerHelper('badgething', function () {
       var today = (new Date).getTime() - (86400000);
       var query = {condition: "created >= " + today};
       var Today1 = Backendless.Data.of( Posts ).find( query );
       console.log(Today1);
       console.log(today);
       return Today1.data.length;
    });
    
    var blogScript = $("#blogs-template").html();
    var blogTemplate = Handlebars.compile(blogScript);
    var blogHTML = blogTemplate(wrapper);
    
    $('.main-container').html(blogHTML);
    
    var blogScriptB = $("#title-template").html();
    var blogTemplateB = Handlebars.compile(blogScriptB);
    var blogHTMLB = blogTemplateB(wrapper);
    
    $('#potatos').html(blogHTMLB);
    
    var blogScriptC = $("#badge-template").html();
    var blogTemplateC = Handlebars.compile(blogScriptC);
    var blogHTMLC = blogTemplateC(wrapper);
    
    $('#tato').html(blogHTMLC);
       
});

function Posts(args) {
    args = args || {};
    this.title = args.title || "";
    this.content = args.content || "";
    this.authorEmail = args.authorEmail || "";
}

$('.button-collapse').sideNav({
      menuWidth: 300, // Default is 240
      edge: 'left', // Choose the horizontal origin
      closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
    }
  );
  
