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
        console.log(updateStatus);
        updateStatus.done(function(response){
            console.log(response);
            if(response){
                console.log("hello world");
                $("#prefrenceStatus").remove();
                $("#prefrences").append("<p id='prefrenceStatus' class='alert alert-success'>Prefrences update successfully </p>");
            }
            else{
                if($("#prefrenceStatus").length === 0){
                    $("#prefrences").append("<p id='prefrenceStatus' class='alert alert-danger'>Prefrences failed to update</p>");
                } 
            }
        });
        event.preventDefault();
    });
})(jQuery)
