class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title);
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
    }
}

class Location extends Scene {
    create(key) {
        //console.log("Location.create key: ", key);
        let locationData = this.engine.storyData.Locations[key]; 
        //console.log("Location.create locationData: ", locationData)
        this.currentLocation = key;
        //console.log(this.currentLocation);

        this.engine.show(locationData.Body);
        if(locationData.Choices && locationData.Choices.length > 0) {
            for(let choice of locationData.Choices) { 
                this.engine.addChoice(choice.Text, choice);
            }
        } else {
            this.engine.addChoice("The end.");
        }

        let itemData = this.engine.storyData.Items;
        for(let item of itemData){
            if(item.Unlocked){
                this.engine.addItem(item.Text, item);
            }
        }

    }

    handleChoice(choice) {
        if(choice) {
            this.engine.show("&gt; "+choice.Text);

            //check if it requires unlocking an item
            if(choice.ItemGrab){
                this.unlockItem(choice.ItemGrab);
            }

            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }

    unlockItem(itemKey){
        let itemData = this.engine.storyData.Items;
        for(let item of itemData){
            if(itemKey == item.Text){
                item.Unlocked = true;
            }
        }

    }

    handleItem(item) {
            this.engine.show("&gt; "+item.Text);

            //if in correct location for action
            if(this.currentLocation == item["Useful Location"]){
                //console.log("Correct Location!");
                this.engine.show(item["Useful Text"]);

                if(item["Next Item"]){
                    this.unlockItem(item["Next Item"]);
                } 

                if(item.Target) this.engine.gotoScene(End);
            }
            else{
                //console.log("Wrong Location!");
                this.engine.show(item["Not Useful Text"]);
            }


    }
}

class End extends Scene {
    create() {
        //clear choices and item boxes
        while(this.engine.actionsContainer.firstChild) {
                this.engine.actionsContainer.removeChild(this.engine.actionsContainer.firstChild)
            }
        while(this.engine.itemsContainer.firstChild) {
            this.engine.itemsContainer.removeChild(this.engine.itemsContainer.firstChild)
        }
        this.engine.show("<hr>");
        this.engine.show("The end.");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');