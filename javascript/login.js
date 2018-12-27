$(function(){
    let loginType; 
    $("#login-button").click(function(){
        $(this).fadeOut();
        $("#signup-button").fadeOut();
        $("#login-type").fadeIn();
    })

    $("#buyer").click(function(){
        loginType="buyer";
        $("#login-type").fadeOut();
        $(".container").fadeIn();
    })

    $("#whlsr").click(function(){
        loginType="vendor"
        $("#login-type").fadeOut();
        $(".container").fadeIn();
    
    })

    $(".login-form").submit(function(){
        event.preventDefault();
        if(loginType==='buyer'){
            //fetch get buyer tables and verify if user exist
            //if user exist, hide vendor div and show buyer div, hide login div as well
            

        }else{
            //fetch get wholesale tables and verify if user exist
            //if user exist, hide buyer div and show vendor div
        }
    })


    //form validation
    $('.login-form').validate({ // initialize the plugin
        rules: {
            user: {
                required: true,
                email: true
            },
            pass: {
                required: true,
                minlength: 4
            }
        }
    });
  
});