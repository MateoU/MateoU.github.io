$(function () {
    var APPLICATION_ID = "D26A0086-F7E9-F507-FFED-0CC7A40B2F00",
        SECRET_KEY = "A51A4E4C-DA96-901B-FF15-31E130192E00",
        VERSION = "v1";
        
    Backendless.initApp(APPLICATION_ID, SECRET_KEY, VERSION);
    if(Backendless.UserService.isValidLogin()){
        userLoggedIn(Backendless.LocalCache.get("current-user-id"));
    } else {
        var loginScript = $("#login-template").html();
        var loginTemplate = Handlebars.compile(loginScript);   
        $('.main-container').html(loginTemplate);
        
    }    
    
    $(document).on('submit', '.form-signin', function(event) {
       event.preventDefault();
       
        var data = $(this).serializeArray(),
           email = data[0].value,
           password = data[1].value;
           
        Backendless.UserService.login(email, password, true, new Backendless.Async(userLoggedIn, gotError));
        
    });
    
    $(document).on('click', '.add-blog', function(){
        var addBlogScript = $("#add-blog-template").html();
        var addBlogTemplate = Handlebars.compile(addBlogScript);
        
        $('.main-container').html(addBlogTemplate);
         tinymce.init({selector:'textarea',plugins: [
        "advlist autolink lists link image charmap print preview anchor",
        "searchreplace visualblocks code fullscreen",
        "insertdatetime media table contextmenu paste"
    ],
    toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
});
    });
    $(document).on('submit', '.form-add-blog', function(event){
       event.preventDefault();
       var x;
       x = document.getElementById("title").value;
       var y;
       y = document.getElementById("content").value;
       if (x == ""){
           Materialize.toast('Title field cannot be empty', 4000, 'rounded');
           return false;
       }
       if (y == ""){
           Materialize.toast('Content field cannot be empty', 4000, 'rounded');
           return false;
       }
       else {
       var data = $(this).serializeArray(),
            title = data[0].value,
            content = data[1].value;
            
       var dataStore = Backendless.Persistence.of(Posts);
       
       var postObject = new Posts({
           title: title,
           content: content,
           authorEmail: Backendless.UserService.getCurrentUser().email
       });
       
       dataStore.save(postObject);
       
       this.title.value = "";
       this.content.value = "";
   }
    });
    
    $(document).on('click', '.logout', function () {
       Backendless.UserService.logout(new Backendless.Async(userLoggedOut, gotError));
       
       var loginScript = $("#login-template").html();
        var loginTemplate = Handlebars.compile(loginScript);   
        $('.main-container').html(loginTemplate);
    });
    
    Handlebars.registerHelper('badgething', function () {
       var today = (new Date).getTime() - (86400000);
       var query = {condition: "created >= " + today};
       var Today1 = Backendless.Data.of( Posts ).find( query );
       console.log(Today1);
       console.log(today);
       return Today1.data.length;
    });
    
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

function userLoggedIn(user) {
    console.log("user successfully logged in");
    var userData;
    if(typeof user == "string"){
        userData = Backendless.Data.of(Backendless.User).findById(user);
    } else{
        userData = user;
    }
    var welcomeScript = $('#welcome-template').html();
    var welcomeTemplate = Handlebars.compile(welcomeScript);
    var welcomeHTML = welcomeTemplate(userData);
    
    $('.main-container').html(welcomeHTML);
    
    $(document).on('click', '.logout-button', function () {
        
        Backendless.UserService.logout(new Backendless.Async(userLoggedOut, gotError));
       
       var loginScript = $("#login-template").html();
        var loginTemplate = Handlebars.compile(loginScript);   
        $('.main-container').html(loginTemplate);
    });
}

function userLoggedOut() {
    console.log("successfully logged out");
    
}

function gotError(error) {
    console.log("Error message - " + error.message);
    console.log("Error code - " + error.code);
    incorrectPassword();
}

function incorrectPassword()  {
    Materialize.toast('Incorrect Username or Password!', 4000, 'rounded');
    var loginScript = $("#login-template").html();
        var loginTemplate = Handlebars.compile(loginScript);   
        $('.main-container').html(loginTemplate);
}

$('.button-collapse').sideNav({
      menuWidth: 300, // Default is 240
      edge: 'left', // Choose the horizontal origin
      closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
    }
  );
  
$(function() {
    $('a[href*=#]:not([href=#])').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top
                }, 1000);
                return false;
            }
        }
    });
});