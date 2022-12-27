# Connecting to mongo db

    docker ps
    docker exec -it 1b0f0b6da6ee mongo -u franciscogsilverio -p minhasenhasecreta --authenticationDatabase heroes

    show dbs -> Displays all dbs
    use heroes -> switch to the heroes db
    show collections -> Displays the tables from the heroes db

# Commands:

    db.heroes.insert({
        name: "Flash",
        power: "speed",
        birthdate: "01-01-1988"
    })

    db.heroes.find().pretty()

    db.heroes.count()

    db.heroes.findOne()

# CRUD:

    -- Create

        db.heroes.insert({
        name: "Flash",
        power: "speed",
        birthdate: "01-01-1988"
    })

    -- Read

        db.heroes.find().pretty()
        db.heroes.findOne()

    --Update
        db.heroes.update({_id : ObjectId("63aaf69a2e0b1bdc79b354ee")},
                {name: "Wonder Woman"})

        db.heroes.update({_id : ObjectId("63aaf69a2e0b1bdc79b354ee")},
                {$set : {name: "Green Lantern"} })

    --Delete

        db.heroes.remove({})
