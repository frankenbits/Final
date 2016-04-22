var Particle = function (name, sum) {
    this.name = name;
    this.sum = sum / 100000000000;
    this.investors = [];

    this.radius = sqrt(sum) / 2850; //change size of particle
    var initialRadius = this.radius;
    var maximumRadius = 90;
    this.radius2 = this.radius * 1.1;

    var tempAng = random(TWO_PI);
    this.pos = createVector(cos(tempAng), sin(tempAng));
    this.pos.div(this.radius);
    this.pos.mult(2000); //how close together the particles are
    
    if (isSingleCompany){
        this.pos.set(this.pos.x, this.pos.y);
    }else{
        this.pos.set(this.pos.x + width / 2, this.pos.y + height / 2);
    }

    this.vel = createVector(0, 0);
    var acc = createVector(0, 0);

    var psizesq = this.psize * this.psize;

    var isMouseOverC = false;
    var isSingleCompany = false;

    //here is where i should tell the particle to find its category from the second table.
    this.category = "other";
    for (var i = 0; i < tableCategories.getRowCount(); i++) {
        var companyName = tableCategories.getString(i, "name");
        if (companyName == this.name) {
            var catCode = tableCategories.getString(i, "category_code");
            this.category = catCode;
        }
    }

    //tell particle to get its investor
    for (var i = 0; i < table.getRowCount(); i++) {
        var companyName = table.getString(i, "company_name");
        if (companyName == this.name) {
            var investorName = table.getString(i, "investor_name");
            this.investors.push(getInvestorParticle(investorName));
        }
    }

    switch (this.category) {
    case "software":
        this.color = {
            h: 229
            , s: 100
            , b: 59
            , a: 80
        }; //blue
        break;

    case "web":
        this.color = {
            h: 33
            , s: 100
            , b: 93
            , a: 80
        }; //orangeish
        break;

    case "biotech":
        this.color = {
            h: 302
            , s: 70
            , b: 60
            , a: 80
        }; //purple
        break;

    case "mobile":
        this.color = {
            h: 109
            , s: 100
            , b: 70
            , a: 80
        }; //green
        break;

    case "enterprise":
        this.color = {
            h: 342
            , s: 100
            , b: 93
            , a: 50
        }; //pink
        break;

    case "ecommerce":
        this.color = {
            h: 58
            , s: 100
            , b: 85
            , a: 80
        }; //yellow
        break;

    default:
        this.color = {
            h: 0
            , s: 0
            , b: 100
            , a: 40
        }; //green-blue
    };

    this.update = function () {

        checkCMouse(this);

        attractors.forEach(function (A) {
            var att = p5.Vector.sub(A.pos, this.pos);
            var distanceSq = att.magSq();
            if (distanceSq > 1) {
                att.normalize();
                att.div(10);
                acc.add(att);
            }

        }, this);

        acc.limit(3);
        this.vel.add(acc);

        this.vel.limit(2);
        this.pos.add(this.vel);
        acc.mult(0);

    }

    //particle - draw yourself
    this.draw = function () {
        noStroke();
        //particle color
        
        fill(this.color.h, this.color.s, this.color.b, this.color.a);

        ellipse(this.pos.x,
                this.pos.y,
                this.radius2 * 2,
                this.radius2 * 2);

        if (isMouseOverC == true || isSingleCompany == true) {
            textFont(book);
            textSize(11);
            textAlign(CENTER);
            fill(33, 7, 35, 100);

            sum = this.sum * 1000;
            rectMode(CORNERS);
            
            var textX = this.pos.x - this.radius /2;
            
            var billion = "\n\n$" + sum.toFixed(1).replace(/(\d)(?=(\d{3})+$)/g, "$1,") + " billion";
                
            var million = "\n$" + sum.toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, "$1,") + " million";
            
        
            
            if (this.sum > 1) {
                textFont(heavy);
                textSize(14);
                text(this.name, this.pos.x - this.radius / 2, this.pos.y - this.radius / 2, this.radius, this.radius);
                
                textFont(book);
                textSize(12);
                text(billion, this.pos.x - this.radius / 2, this.pos.y, this.radius, this.radius);
                
            } else {
                if (this.name.length > 20) {
                    textFont(heavy);
                    textSize(14);
                    text(this.name, this.pos.x - this.radius / 2, this.pos.y - this.radius / 2, this.radius, this.radius);
                    textFont(book);
                    textSize(12);
                    text(million, this.pos.x - this.radius / 2, this.pos.y, this.radius, this.radius);
                    
                } else {
                    textFont(heavy);
                    textSize(14);
                    text(this.name, this.pos.x - this.radius / 2, this.pos.y - this.radius / 2, this.radius, this.radius);
                    textFont(book);
                    textSize(12);
                    text(million, this.pos.x - this.radius / 2, this.pos.y, this.radius, this.radius);
                    
                }
            }
        } else {
            fill(0, 0, 100, 25);
        }
        
        

    }

    //particle checks itself to see if mouse is over it
    function checkCMouse(instance) {
        var mousePos = createVector(mouseX, mouseY);

        if (mousePos.dist(instance.pos) <= instance.radius) {
            incRadius(instance);
            isMouseOverC = true;
        } else {
            decRadius(instance);
            isMouseOverC = false;
        }

        //increase particle size
        function incRadius(instance) {
            instance.radius += 4;
            if (instance.radius > maximumRadius) {
                instance.radius = maximumRadius;
            }
        }
        //decrease particle size
        function decRadius(instance) {
            instance.radius -= 4;
            if (instance.radius < initialRadius) {
                instance.radius = initialRadius;
            }
        }

    }

    //make getMouseOver available outside of the checkMouse function
    this.getMouseOverC = function () {
        return isMouseOverC;
    }
}
