(function($){ 
    $("#prefrences").submit(function(e){
        let inputArray = $(this).find(":input[type=checkbox]");
        let newPrefrences = [];
        for(let i = 0; i < inputArray.length; ++i){
            if($(inputArray[i]).prop("checked")){
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
})(jQuery)
