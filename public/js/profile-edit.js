(function($){ 
    $("#prefrences").submit(function(e){
        let inputArray = $(this).find(":input[type=checkbox]");
        let newPrefrences = []; for(let i = 0; i < inputArray.length; ++i){ if($(inputArray[i]).prop("checked")){
                newPrefrences.push($(inputArray[i]).val());
            }
        }
        var updateStatus = $.post(
            "/updatePreferences",
            {"prefrences[]":(newPrefrences.length !== 0) ? newPrefrences : [""]},
            function(data){
            return data;
            },
            "json"
        );
        updateStatus.done(function(response){
            if(response){
                $("#prefrenceStatus").remove();
                $("#prefrences").append("<p id='prefrenceStatus' class='alert alert-success'>Prefrences update successfully </p>");
            }
            else{
                $("#prefrenceStatus").remove();
                $("#prefrences").append("<p id='prefrenceStatus' class='alert alert-danger'>Prefrences failed to update</p>");
            }
        });
        event.preventDefault();
    });

    $("#username").submit(function(e){
        let newUsername = $("#newName").val();
        let updateStatus = $.post(
            "/updateName",
            {"newName":newUsername},
            function(response){
                return response;
            },
            "json"
        );
        updateStatus.done(function(response){
            if(response){
                $("#nameStatus").remove();
                $("#username").append("<p id='nameStatus' class='alert alert-success'>Username update successfully </p>");
            }
            else{
                $("#nameStatus").remove();
                $("#username").append("<p id='nameStatus' class='alert alert-danger'>Username failed to update</p>");
            }
        });
        event.preventDefault();
    });

    $("#password").submit(function(e){
        let newPassword = $("#newPassword").val();
        let updateStatus = $.post(
            "/updatePassword",
            {"newPassword":newPassword},
            function(response){
                return response;
            },
            "json"
        );
        updateStatus.done(function(response){
            if(response){
                $("#passwordStatus").remove();
                $("#password").append("<p id='passwordStatus' class='alert alert-success'>Password update successfully </p>");
            }
            else{
                $("#passwordStatus").remove();
                $("#password").append("<p id='passwordStatus' class='alert alert-danger'>Username failed to update</p>");
            }
        });
        event.preventDefault();
    });

    $("#location").submit(function(e){
        let newUsername = $("#newLocation").val();
        let updateStatus = $.post(
            "/updateLocation",
            {"newLocation":newUsername},
            function(response){
                return response;
            },
            "json"
        );
        updateStatus.done(function(response){
            if(response){
                $("#locationStatus").remove();
                $("#location").append("<p id='locationStatus' class='alert alert-success'>Location update successfully </p>");
            }
            else{
                $("#locationStatus").remove();
                $("#location").append("<p id='locationStatus' class='alert alert-danger'>Location failed to update</p>");
            }
        });
        event.preventDefault();
    });

    $("#email").submit(function(e){
        event.preventDefault();
        let newEmail = $("#newEmail").val();
        let updateStatus = $.post(
            "/updateEmail",
            {"newEmail":newEmail},
            function(response){
                return response;
            },
            "json"
        );
        updateStatus.done(function(response){
            if(response){
                $("#emailStatus").remove();
                $("#email").append("<p id='emailStatus' class='alert alert-success'>Email update successfully </p>");
            }
            else{
                $("#emailStatus").remove();
                $("#email").append("<p id='emailStatus' class='alert alert-danger'>Email failed to update</p>");
            }
        });
    });

})(jQuery)
