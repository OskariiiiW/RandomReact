let salaisuus = "SuuriSalaisuus!!!";

let token = require("jsonwebtoken").sign({}, salaisuus, {algorithm : "HS256"});

//pitaa kai olla server -kansiossa, etta toimii