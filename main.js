var particleSystem = []; //array of particles. each particle has company name, investor, and amount invested
var attractors = []; //array of attractors
var attractors2 = []; //second attractor array
var table;
var aggregated = {}; //the object used to store companies and sums of amounts
var AggregatedInvestors = {}; //the object used to store top 200 investors and amounts
var uniqueInvestors = []; //array of unique investors of the top 200 companies
var connections = []; //array of connections between uniqueInvestors and aggregated
var specialConnections = []; //object used to store company categories
var investorSystem = []; //array of investors
var companiesDisplay = []; //array of displayed particles that excludes the particle that was clicked on
var investorDisplay = []; //array of investor particles that is currently being displayed
var connectionsDisplay = [];
var isMouseOverI = false;
var isMouseOverC = false;
var isSingleCompany = false;

var attractorsInvestors = [];


function preload() {
    table = loadTable("data/investments.csv", "csv", "header");
    tableCategories = loadTable("data/companies_categories.csv", "csv", "header");

    book = loadFont("Fonts/Avenir/Avenir-Book.ttf");
    light = loadFont("Fonts/Avenir/Avenir-Light.ttf");
    roman = loadFont("Fonts/Avenir/Avenir-Roman.ttf");
    medium = loadFont("Fonts/Avenir/Avenir-Medium.ttf");
    heavy = loadFont("Fonts/Avenir/Avenir-Heavy.ttf");
    lightoblique = loadFont("Fonts/Avenir/Avenir-LightOblique.ttf");
    
    img = loadImage("clouds.png");
}

//------------------SETUP------------------------------------------//
function setup() {
    var canvas = createCanvas(windowWidth, windowHeight);
    frameRate(30);

    colorMode(HSB, 360, 100, 100, 100);
    background(0);

    var at = new Attractor(createVector(width / 2, height / 2), 10);
    attractors.push(at);


    attractorsInvestors.push(new Attractor(createVector(width / 2 - 55, 130), 2));

    attractorsInvestors.push(new Attractor(createVector(width / 2 + 185, 130), 2));
    
    //attractorsInvestors.push(new Attractor(createVector(width/ 2 + 50, 200), 1));

    //aggregates companies into the object aggregated
    for (var r = 0; r < table.getRowCount(); r++) {
        var cname = table.getString(r, "company_name");
        var iname = table.getString(r, "investor_name");
        var invested = table.getString(r, "amount_usd");

        invested = parseInt(invested);

        if (!isNaN(invested)) {
            if (aggregated.hasOwnProperty(cname)) {
                aggregated[cname] = aggregated[cname] + invested;
            } else {
                aggregated[cname] = invested;
            }

        }

        if (!isNaN(invested)) {
            if (uniqueInvestors.hasOwnProperty(iname)) {
                uniqueInvestors[iname] += invested;
            } else {
                uniqueInvestors[iname] = invested;
                //print("hello");
            }
        }

        AggregatedInvestors[iname] = "gibberish";
    }

    var aAggregated = [];
    Object.keys(aggregated).forEach(function (name_) {
        var company = {};
        company.name = name_;
        company.sum = aggregated[name_]
        aAggregated.push(company);
    });

    var aAggregatedInvestors = [];
    Object.keys(AggregatedInvestors).forEach(function (name_) {
        var investor = {};
        investor.name = name_;
        investor.amount = AggregatedInvestors[name_];
        aAggregatedInvestors.push(investor);
    });

    aAggregated = aAggregated.sort(function (companyA, companyB) {
        return companyB.sum - companyA.sum;
    });

    aAggregated = aAggregated.slice(0, 200);

    var categoryObject = {};
    for (var r = 0; r < tableCategories.getRowCount(); r++) {
        //var companyName = tableCategories.getString(r, "name");
        var categoryName = tableCategories.getString(r, "category_code");
        if (categoryObject.hasOwnProperty(categoryName)) {
            categoryObject[categoryName]++;
        } else {
            categoryObject[categoryName] = 1;
        }

    }

    //treat object like its an array
    Object.keys(categoryObject).forEach(function (categoryName) {});

    for (var r = 0; r < table.getRowCount(); r++) {
        var cname = table.getString(r, "company_name");
        var iname = table.getString(r, "investor_name");
        var invested = table.getString(r, "amount_usd");

        var foundCompany = aAggregated.find(function (element, index, array) {
            if (element.name == cname) return true;
            else return false;
        });

        var foundInvestor = false;
        if (foundCompany) {
            foundInvestor = aAggregatedInvestors.find(function (element, index, array) {
                if (element.name == iname) return true;
                else return false;
            });

        }

        //creates the connection object
        if (foundCompany && foundInvestor) {
            var connection = {};
            connection.company = foundCompany;
            connection.investor = foundInvestor;
            connection.amount = invested;
            connections.push(connection);
        }

    }

    connections.forEach(function (connection) {
        var found = uniqueInvestors.find(function (uniqueInvestor) {
            return uniqueInvestor == connection.investor;
        });

        if (!found) uniqueInvestors.push(connection.investor);
    });
    
    
    //creates new investor particle and gives them a location but does not draw them.
    //var angleInc = TWO_PI / uniqueInvestors.length;

    //var ang = 0; //start with angle of 0
    uniqueInvestors.forEach(function (i) {
        investorSystem.push(new InvestorParticle(i.name, i.amount));

        //ang = ang + random(PI / 3, PI / 2);

    });


    for (var i = 0; i < aAggregated.length; i++) {
        var p = new Particle(aAggregated[i].name, aAggregated[i].sum);
        particleSystem.push(p);
        companiesDisplay.push(p);
    }

    connections.forEach(function (connection) {
        var sc = new SpecialConnection(
            getCompanyParticle(connection.company)
            , getInvestorParticle(connection.investor.name)
            , connection.amount);
        specialConnections.push(sc);
    });
    

}
//------------------END SETUP------------------------------------------//

function getCompanyParticle(company) {
    for (var i = 0; i < particleSystem.length; i++) {
        if (particleSystem[i].name == company.name) {
            return particleSystem[i];
        }
    }
}

function getInvestorParticle(investorName) {
    for (var i = 0; i < investorSystem.length; i++) {
        if (investorSystem[i].name == investorName) {
            return investorSystem[i];

        }
    }
}

function collide(particles) {
    for (var STEPS = 0; STEPS < 3; STEPS++) {
        //make a collision
        for (var i = 0; i < particles.length - 1; i++) {
            for (var j = i + 1; j < particles.length; j++) {
                var pa = particles[i];
                var pb = particles[j];
                var ab = p5.Vector.sub(pb.pos, pa.pos);
                var distSq = ab.magSq();
                if (distSq <= sq(pa.radius + pb.radius)) {
                    var dist = sqrt(distSq);
                    var overlap = (pa.radius + pb.radius) - dist;
                    ab.div(dist);
                    ab.mult(overlap * 0.4);
                    pb.pos.add(ab);
                    ab.mult(-1);
                    pa.pos.add(ab);
                    pa.vel.mult(0.97);
                    pb.vel.mult(0.97);
                }
            }
        }
    }

}

//------------------DRAW------------------------------------------//
function draw() {
    //var isSingleCompany = false;

    background(189, 43, 100, 40);
    //blendMode(REPLACE);

    collide(companiesDisplay);
    collide(investorDisplay);
    
    investorDisplay.forEach(function (inv) {
        inv.update();
        inv.draw();
    });
    

    for (var i = companiesDisplay.length - 1; i >= 0; i--) {
        var p = companiesDisplay[i];
        p.update();
        p.draw();
    }
    
    connectionsDisplay.forEach(function (c) {
        c.draw();
    });

    attractors.forEach(function (at) {
        at.draw();
    });

    attractorsInvestors.forEach(function (at) {
        at.draw();
    });

    Title();

    backButton();
    
    categories();
    
    iText();
    
}
//------------------END DRAW------------------------------------------//
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

var Attractor = function (pos, s) {
    this.pos = pos.copy();
    var strength = s;

    this.draw = function () {
        noStroke();
        fill(0, 100, 100);
        ellipse(this.pos.x, this.pos.y
            , strength, strength);
    }
    this.getStrength = function () {
        return strength;
    }
    this.getPos = function () {
        return this.pos.copy();
    }
}

var Title = function () {
    var posXTitle = 28;
    var posYTitle = 60 ;

    var posXAtt = posXTitle;
    var posYAtt = posYTitle + 15;

    var title = "INFLATING INNOVATION";

    var att = "DATA SOURCE:\nCrunchBase 2013 Snapshot\n©2013, Creative Commons Attribution License";
    
    var cara = "Cara Frankowicz\nMFA Information Design & Visualization Candidate, Northeastern University\nA visualization project for ARTG 5330 Visualization Technologies, Spring 2016\n"


    rectMode(CORNER);
    textAlign(RIGHT);
    textFont(lightoblique);
    textSize(10);
    fill(217, 100, 56);
    text(att, width/2 + width/2.2, height/1.1);
    
    rectMode(CORNER);
    textAlign(LEFT);
    textFont(medium);
    textSize(32);
    fill(217, 100, 56);
    text(title, posXTitle, posYTitle);

    rectMode(CENTER);
    textAlign(LEFT);
    textFont(lightoblique);
    textSize(10);
    fill(217, 100, 56);
    text(cara, posXAtt, posYAtt);
    
    if (isSingleCompany == false) {
        var posXExp = posXTitle;
        var posYExp = posYTitle + 50;
        
        
        var exp = "Explore companies, investors, and the investments that connect them. \nHover over a balloon to view the name of the company and the total amount invested. \nClick on a balloon to see its individual investors."
        
        rectMode(CORNER);
        textAlign(LEFT);
        textFont(roman);
        textSize(13);
        textLeading(19);
        fill(33, 7, 35, 100);
        text(exp, posXExp, posYExp, 300, 400);
    }
}

function backButton() {
    if (isSingleCompany) {
        var posX = width / 8;
        var posY = height / 1.1;

        fill(360, 0, 100);
        noStroke();
        rectMode(CORNER);
        rect(posX, posY, 80, 30, 20);

        fill(245, 92, 100);
        rectMode(CORNER);
        textAlign(CENTER);
        textFont(heavy);
        textSize(16);
        text("BACK", posX, posY - 2, 80, 30);
        
    }
}

function categories() {
    if (isSingleCompany == false) {
        var posX = width / 30;
        var posY = height / 2.5;
        textAlign(LEFT);
        //textFont(raleway);
        textSize(12);
        this.radius = 14;
        
        var textPosX = posX + 18;
        var textPosY = posY + 4;
        
        textFont(medium);
        fill(33, 7, 35, 100);
        rectMode(CORNER);
        text("COMPANY TYPE", posX - 11, posY - this.radius - 10);
        
        //software, blue
            fill(229, 100, 59, 80);
            noStroke();
            ellipse(posX, posY, this.radius, this.radius);
            
            textFont(roman);
            fill(33, 7, 35, 100);
            text("software", textPosX, textPosY);
        
        //web, orange
            fill(33, 100, 93, 80);
            noStroke();
            ellipse(posX, posY + this.radius * 2, this.radius, this.radius);
            
            fill(33, 7, 35, 100);
            text("web", textPosX, textPosY + this.radius * 2);
        
        //biotech, purple
            fill(302, 70, 60, 80);
            noStroke();
            ellipse(posX, posY + this.radius * 4, this.radius, this.radius);
        
            fill(33, 7, 35, 100);
            text("biotech", textPosX, textPosY + this.radius * 4);
        
        //mobile, green
            fill(109, 100, 70, 80);
            noStroke();
            ellipse(posX, posY + this.radius * 6, this.radius, this.radius);
        
            fill(33, 7, 35, 100);
            text("mobile", textPosX, textPosY + this.radius * 6);
        
        //enterprise, pink
            fill(342, 100, 93, 50);
            noStroke();
            ellipse(posX, posY + this.radius * 8, this.radius, this.radius);
            
            fill(33, 7, 35, 100);
            text("enterprise", textPosX, textPosY + this.radius * 8);
        
        //ecommerce, yellow
            fill(58, 100, 85, 80);
            noStroke();
            ellipse(posX, posY + this.radius * 10, this.radius, this.radius);
            
            fill(33, 7, 35, 100);
            text("ecommerce", textPosX, textPosY + this.radius * 10);
        
        //white, other
            fill(0, 0, 100, 40);
            noStroke();
            ellipse(posX, posY + this.radius * 12, this.radius, this.radius);
            
            fill(33, 7, 35, 100);
            text("other", textPosX, textPosY + this.radius * 12);
        
    
    }

}

function iText(){
    if(isSingleCompany){
        var posXExp = 28;
        var posYExp = 110;
        
        var exp = "This shows the selected company and its investors. \nA thicker line means a larger sum was invested. \nIn some cases, one investor made more than one \ninvestment into the same company.\nHover over the investor bubble to see the name."
        
        rectMode(CORNER);
        textAlign(LEFT);
        textFont(book);
        textSize(13);
        textLeading(19);
        fill(33, 7, 35, 100);
        text(exp, posXExp, posYExp, 400, 600);
        
        imageMode(CENTER);
        colorMode(RGB, 255, 255, 255);
        tint(255, 128);
        image(img, width/4 + width/2, height/10, img.width / 5, img.height / 5);
        
    }
}
