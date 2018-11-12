db.tickets.find({}).forEach(el => {
    db.tickets.update({_id: el._id},{$set:{condominio: String(el.condominio)}})
});
db.users.aggregate([
    {$match:{
        username: "juli"
    }},
    {$lookup:{
        from:  "tickets",
        localField: "username",
        foreignField: "createdBy",
        as: "tickets"
    }},
    {

    }
]).pretty()
db.tickets.aggregate([

    { $lookup: {
      from: "tickets",
      let: { c: "$ticket" },
      pipeline: [
        {$match: {
          $expr:{
            $eq: ["$_id", "$$c"]
          }
        }},
      ],
      as: "comments"
    }}
  ]).pretty()
