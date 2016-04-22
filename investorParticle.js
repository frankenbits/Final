var InvestorParticle = function (name, amount) {
    this.name = name;
    this.amount = amount / 100000000000;
    this.radius = 22;
    this.diam = this.radius * 2;
    this.vel = createVector(0, 0);
    var acc = createVector(0, 0);

    var ang = random(TWO_PI);
    this.pos = createVector(cos(ang), sin(ang));
    this.pos.div(this.radius);
    this.pos.mult(4000); //how close together the particles are
    this.pos.set(this.pos.x + width / 2, this.pos.y - height / 4);


    var isMouseOverI = false;

    for (var i = 0; i < table.getRowCount(); i++) {
        var iname = table.getString(i, "investor_name")
        if (iname == this.name) {
            var amount = table.getString(i, "amount_usd");
            this.amount = amount;
        }
    }

    this.update = function () {

        checkIMouse(this);
        //checkEdges();


        attractorsInvestors.forEach(function (A) {
            var att = p5.Vector.sub(A.pos, this.pos);
            var distanceSq = att.magSq();
            if (distanceSq > 1) {
                att.normalize();
                att.div(10);
                att.mult(A.getStrength());
                acc.add(att);
            }

        }, this);


        acc.limit(3);
        this.vel.add(acc);
        this.vel.limit(2);
        this.pos.add(this.vel);
        acc.mult(0.3);

    }

    this.draw = function () {
        
        if (isMouseOverI == true) {
            textAlign(CENTER);
            fill(33, 7, 35, 100);

            amount = this.amount / 1000000;
            
            var billion = "\n\n$" + amount.toFixed(1).replace(/(\d)(?=(\d{3})+$)/g, "$1,") + " billion";
                
            var million = "\n$" + amount.toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, "$1,") + " million";

            if (this.amount > 1) {
                textFont(heavy);
                textSize(14);
                text(this.name, this.pos.x + width/4, this.pos.y);
                
                textFont(book);
                textSize(12);
                text(billion, this.pos.x + width/4, this.pos.y);
                
            } else {
                if (this.name.length > 20) {
                    textFont(heavy);
                    textSize(14);
                    text(this.name, this.pos.x + width/4, this.pos.y);
                    textFont(book);
                    textSize(12);
                    text(million, this.pos.x + width/4, this.pos.y);
                    
                } else {
                    textFont(heavy);
                    textSize(14);
                    text(this.name, this.pos.x + width/4, this.pos.y);
                    textFont(book);
                    textSize(12);
                    text(million, this.pos.x + width/4, this.pos.y);
                    
                }
            }
        } else {
            fill(0, 0, 100, 25);
        }
        
        noStroke();
        textFont(book);
        textSize(11);
        fill(33, 7, 35, 100);

        fill(0, 0, 100, 30);
        ellipse(this.pos.x
            , this.pos.y
            , this.radius * 2
            , this.radius * 2);

    }


    //particle checks itself to see if mouse is over it
    function checkIMouse(instance) {
        var mousePos = createVector(mouseX, mouseY);

        if (mousePos.dist(instance.pos) <= instance.radius) {
            isMouseOverI = true;
        } else {
            isMouseOverI = false;
        }
    }

    
    this.getMouseOverI = function () {
        return isMouseOverI;
    }


}