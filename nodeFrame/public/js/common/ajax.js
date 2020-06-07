const ajax = {
    createJsonData: function(url, data){
        return $.ajax({
            url: url,
            type: 'POST',
            data: data,
            dataType: 'json',
            async: false,
            success: function(data){

            }
        }).responseJSON;
    },
    createFormData: function(url, data){
        return $.ajax({
            url: url,
            type: 'POST',
            data: data,
            processData: false,
            contentType: false,
            async: false,
            success: function(data){

            }
        }).responseJSON;
    },
    readData: function(url, data){
        return $.ajax({
            url: url,
            type: 'GET',
            data: data,
            dataType: 'json',
            async: false,
            success: function(data){

            }
        }).responseJSON;
    },
    largeData: function(url, data){
        return $.ajax({
            url: url,
            type: 'POST',
            data: data,
            dataType: 'json',
            contentType: 'application/json',
            processData: false,
            async: false,
            success: function(data){

            }
        }).responseJSON;
    },
    updateData: function(url, data){
        return $.ajax({
            url: url,
            type: 'PUT',
            data: data,
            dataType: 'json',
            async: false,
            success: function(data){

            }
        }).responseJSON;
    },
    deleteData: function(url, data){
        return $.ajax({
            url: url,
            type: 'DELETE',
            data: data,
            dataType: 'json',
            async: false,
            success: function(data){

            }
        }).responseJSON;
    }
};

function ajaxFunc(url, type, data, dataType){
    if( dataType === 'json' ){
        return $.ajax({
            url: url,
            type: type,
            data: data,
            dataType: dataType,
            //processData: true,
            //contentType: "application/json",
            async: false,
            success: function(data){
                //console.log(data);
            }
        }).responseJSON;
    }else { //파일 업로드
        console.log('ggg');
        return $.ajax({
            url: url,
            type: type,
            data: data,
            processData: false,
            contentType: false,
            async: false,
            success: function(data){
                //console.log(data);
            }
        }).responseJSON;
    }
};