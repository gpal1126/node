## upsert.js : create or update function
- 값이 없으면 create, 값이 있으면 update  
    - model : 모델  
    - values: insert or update할 값들  
    - condition : where 조건에 들어갈 값  

```
/* insert or update function */
module.exports = function (model, values, condition) {
    return model
    .findOne({ where: condition })
    .then(function(obj) {
        if(obj) { // update
            return obj.update(values);
        }
        else { // insert
            return model.create(values);
        }
    })
};
```
  
### function 호출
```
const upsert = require('../common/upsert'); //insert or update func
...생략
upsert( 
    Page    //model
, {         //values
    user_id: userId,
    title: title,
    name: name,
    ...생략
}, {        //condition
    user_id: userId, 
}).then(function(rst){
    res.json(rst);
});
```

