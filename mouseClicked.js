function mouseClicked() {
    var clickedParticle = null;

    //if the mouse is over the particle and the mouse button is clicked, then particle becomes 'clickedParticle'
    for (var i = 0; i < particleSystem.length; i++) {
        var particle = particleSystem[i];
        if (particle.getMouseOverC()) {
            clickedParticle = particle;
        }
    }
    
    

    var posX = width / 8;
    var posY = height / 1.1;

    var overButton = (mouseX >= posX  && mouseX <= posX + 80 && mouseY >= posY && mouseY <= posY + 30);

    //if clickedParticle exists
    if (clickedParticle != null) {
        //dump those arrays so that you only have the clicked particle
        
        isSingleCompany = true;
        
        attractors[0].pos.set(width/2 + 50, height / 1.1);
        investorDisplay = [];
        companiesDisplay = [];
        connectionsDisplay = [];
        
        
        var cname = clickedParticle.name;
        connections.forEach(function (c) {
            if (cname == c.company.name) {
                var iname = c.investor.name;
                var iparticle = getInvestorParticle(iname);
                var foundInvestor = investorDisplay.find(function (element) {
                    if (element == iparticle) return true;
                    else return false;
                });

                if (!foundInvestor) {
                    investorDisplay.push(iparticle);
                }

            }
        });
        
        companiesDisplay.push(clickedParticle);
        
        specialConnections.forEach(function (sc) {
            if (sc.companyParticle == clickedParticle) {
                connectionsDisplay.push(sc);
            }
        });
        

        //reset data structure
    } else if(overButton){
        isSingleCompany = false;
        attractors[0].pos.set(width/2, height/2);
        companiesDisplay = [];
        investorDisplay = [];
        connectionsDisplay = [];
        particleSystem.forEach(function (p) {
            companiesDisplay.push(p);
        });
    }

}
