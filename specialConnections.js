var SpecialConnection = function (companyParticle, investorParticle, amount) {
    this.companyParticle = companyParticle;
    this.investorParticle = investorParticle;
    this.amount = amount;


    this.id = random(0, 100);



    this.draw = function () {
       

        //create vector that points from investorParticle to companyParticle
        //calculate length (magnitude)
        var v = p5.Vector.sub(this.companyParticle.pos, this.investorParticle.pos);
        this.length = v.mag();
        v.normalize();


        v.mult(this.length / 3);

        //create X, Y for vertex A
        var aX = this.companyParticle.pos.x - v.x;
        var aY = this.companyParticle.pos.y - v.y;
        //create X, Y for vertex B

        v.normalize();
        v.mult(2 * this.length / 3);
        var bX = this.companyParticle.pos.x - v.x;
        var bY = this.companyParticle.pos.y - v.y;

        v.normalize();
        v.rotate(HALF_PI);

        var v2 = v.copy();

        var maxShift1 = 50;
        var temporalVariation1 = 200;

        var maxShift2 = 25;
        var temporalVariation2 = 50;

        var noise1 = map(noise(frameCount / temporalVariation1 + this.id), 0, 1, -maxShift1, maxShift1);
        var noise2 = map(noise(frameCount / temporalVariation2 + 100 + this.id), 0, 1, -maxShift2, maxShift2);


        v.mult(noise1);
        v2.mult(noise2);

        //place vertices at X, Y for points A and B

        //strokeWeight(sqrt(this.amount) / 2500);

        strokeWeight(sqrt(sqrt(this.amount)) / 100);
        //strokeWeight(2);
        stroke(0, 0, 0, 20);
        noFill();

        /*curveTightness(t);
        1 = straight lines
        Values within the range -5.0 and 5.0 will deform the curves but will leave them recognizable and as values increase in magnitude, they will continue to deform.*/

        //curveTightness(0.2);

        beginShape();


        curveVertex(this.companyParticle.pos.x, this.companyParticle.pos.y);
        curveVertex(this.companyParticle.pos.x, this.companyParticle.pos.y);

        curveVertex(aX + v.x, aY + v.y);
        curveVertex(bX + v2.x, bY + v2.y);

        curveVertex(this.investorParticle.pos.x, this.investorParticle.pos.y);
        curveVertex(this.investorParticle.pos.x, this.investorParticle.pos.y);
        endShape();

        strokeWeight(1);
        stroke(0);
        noFill();


    }

}