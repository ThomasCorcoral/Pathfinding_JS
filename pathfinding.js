// Convention nommage : - Var minuscule puis majuscule à chaque nouveau mot
//                      - Fonction Pas de majuscule, underscore entre chaque mot
//                      - Object majuscule au début 

const nbPoints = 10;

class Point {
    constructor (xCoord, yCoord, choose) {
        this.x = xCoord;
        this.y = yCoord;
        this.isChoose = choose;
    }
}

window.onload = function(){
    //localStorage.setItem('resultats', '');
    main();
}

function main(){
    var score = 0;
    var toPrint = "";
    var step = 0;
    var save_score = 0;
    //console.log("Background color : " + sessionStorage.getItem("Background"));
    if(sessionStorage.getItem("Background") == null )
    {
        sessionStorage.setItem("Background","White");
    }
    set_background();
    //sessionStorage.setItem("Background","White");
    var arrPoints = init_points();
    toPrint = str_score(score, step);
    toPrint = toPrint + str_point(arrPoints);
    prnt_str(toPrint);

    var doClick = (event) => event_handler(event, arrPoints, score, step); 
    document.body.addEventListener('mousemove', doClick);

    document.addEventListener('click', function (event) {
        //console.log("clic detected in : " + event.target.id);
        if(event.target.closest("div") && score != -1)
        {
            //console.log(event.target.id);
            if(!(event.target.id == "" || isNaN(event.target.id)))
            {
                step++;
                //console.log("id du point selectionné : " + event.target.id);
                save_score = score;
                score = click_checker(event.target.id, arrPoints, score);
                if(score == -1)
                {
                    arrPoints[event.target.id].isChoose = 2;
                    arrPoints[closest_point(arrPoints)].isChoose = 3;            
                    toPrint = "";
                    toPrint = str_score(score, step);
                    toPrint = toPrint + str_point(arrPoints);
                    toPrint = toPrint + str_highscores();
                    prnt_str(toPrint);
                    document.body.removeEventListener('mousemove', doClick);
                    alert("Perdu !");
                    var rank = check_top_ten(save_score)
                    if(rank <= 10 )
                    {
                        var name = window.prompt("Entrez votre nom : ");
                        var toStore = rank + "/" + name + "/" + save_score + "/" + step + "/";
                        localStorage.setItem('resultats', localStorage.getItem('resultats') + ' ' + toStore);
                        sort_storage();
                    }
                }
                else
                {
                    toPrint = "";
                    toPrint = str_score(score, step);
                    toPrint = toPrint + str_point(arrPoints);
                    prnt_str(toPrint);
                }
            }
        }
    });
}

function event_handler(event, arrPoints, score, step) {
    //console.log("Test score : " + score);
    if(!(event.target.id == "" || isNaN(event.target.id)))
    {
        toPrint = str_score(score, step);
        toPrint = toPrint + str_point(arrPoints);
        toPrint += str_hr(arrPoints, event.target.id);
        prnt_str(toPrint);
    }
    else
    {
        toPrint = str_score(score, step);
        toPrint = toPrint + str_point(arrPoints);
        prnt_str(toPrint);
    }
}

function str_hr(arrPoints, id)
{
    window.innerWidth / window.innerHeight;
    var x1 = arrPoints[0].x * window.innerHeight / 100;
    var x2 = arrPoints[id].x * window.innerHeight / 100;
    var y1 = arrPoints[0].y * window.innerWidth / 100;
    var y2 = arrPoints[id].y * window.innerWidth / 100;
    var xlen = Math.abs(x2 - x1);
    var ylen = Math.abs(y2 - y1);
    var len = Math.sqrt(Math.pow(xlen, 2) + Math.pow(ylen, 2));
    var str = "";
    var angle = Math.atan(ylen / xlen) * 180 / Math.PI;;

    if( y2 < y1) // à gauche 
    {
        if(x2 < x1) // en haut
        {
            angle = 90 - angle + 180;
            str += "<hr width=\"" + len + "px\" style=\"top:" + x1 + "px; left:" + y1 + "px; transform: rotate(" + angle + "deg);\"></hr>";
        }
        else // En Bas
        {
            angle += 90;
            str += "<hr width=\"" + len + "px\" style=\"top:" + x1 + "px; left:" + y1 + "px; transform: rotate(" + angle + "deg);\"></hr>";
        }
    }
    else // à droite
    {
        if(x2 < x1) // En Haut
        {
            angle += 270;
            str += "<hr width=\"" + len + "px\" style=\"top:" + x1 + "px; left:" + y1 + "px; transform: rotate(" + angle + "deg);\"></hr>";
        }
        else // En Bas
        {
            angle = 90 - angle;
            str += "<hr width=\"" + len + "px\" style=\"top:" + x1 + "px; left:" + y1 + "px; transform: rotate(" + angle + "deg);\"></hr>";
        }
    }
    return str;
}

function get_to_sort()
{
    var higher = 0;
    var i = 2;
    var y = 0;
    var res = localStorage.getItem('resultats');
    var toSort = [];
    res = res.split("/");
    do
    {
        toSort[y] = res[i];
        y++;
        i+=4;
    }while(i < res.length);
    return toSort;
}

function sort_storage()
{
    var rank = 0;
    var index = -1;
    var toSort = get_to_sort();
    console.log(toSort);
    toSort.sort((a,b)=>a-b);
    console.log(toSort);
    toSort.reverse();
    console.log(toSort);
    var new_res = "";
    var res = localStorage.getItem('resultats');
    res = res.split("/");
    if(toSort.length >= 10)
    {
        length = 10;
    }
    else
    {
        length = toSort.length;
    }
    for (var i=0; i < length; i++)
    {
        //console.log(toSort[i]);
        index = res.indexOf(toSort[i]);
        //console.log(index);
        rank++;
        new_res += rank + "/" + res[index-1] + "/" + res[index] + "/" + res[index+1] + "/";
    }
    console.log(new_res);
    localStorage.setItem('resultats', new_res);
}

function check_top_ten(score)
{
    var rank = 1;
    var res = localStorage.getItem('resultats');
    if(res != null)
    {
        var i = 3;
        res = res.split("/");
        //console.log("taille res : " + res.length);
        do
        {
            if(res[i] > score)
            {
                rank++;
                console.log("rank = " + rank);
            }
            console.log("i : " + i);
            i+=4;
        }while(i < res.length);
    }
    return rank;
}

function click_checker(id, arrPoints, score)
{
    if(id == 0)
    {
        alert("Merci de bien vouloir choisir un autre point");
    }
    else
    {
        var closer = closest_point(arrPoints);
        //console.log("id du point le plus proche: " + closer);
        if(closer == id)
        {
            var points = distance(arrPoints[0], arrPoints[closer]);
            var ratio = window.innerWidth / window.innerHeight;
            score += Math.floor(points * ratio);
            arrPoints = update_points(id, arrPoints);
        }
        else
        {
            score = -1;
        }
    }
    return score;
}

function closest_point(arrPoints)
{
    var dist = distance(arrPoints[0], arrPoints[1]);
    var id = 1;
    for (var i=2; i < nbPoints; i++)
    {
        //console.log("Distance calculée: " + dist);
        var newDist = distance(arrPoints[0], arrPoints[i]);
        if(dist > newDist)
        {
            dist = newDist;
            id = i;
        }
    }
    //console.log("Distance calculée: " + dist);
    return id;
}

function update_points(id, arrPoints)
{
    arrPoints[0] = arrPoints[id];
    arrPoints[0].isChoose = 0;
    do
    {
        arrPoints[id] = add_point(1);
    }while(!check_points(arrPoints));
    return arrPoints;
}

function set_background()
{
    if(sessionStorage.getItem("Background") == "White")
    {
        document.body.className = "";
    }
    else
    {
        document.body.className = "darkmode";
    }
}

document.addEventListener("keypress", function(e) {
    //On aurait pu utiliser e.which mais which est obsolète.
    if(e.key == "d")
    {
        if(sessionStorage.getItem("Background") == "White")
        {
            sessionStorage.setItem("Background","Black");
        }
        else
        {
            sessionStorage.setItem("Background","White");
        }
        set_background();
    }
});

// Calcul la distance entre deux points
function distance(pt1, pt2)
{
    var ratio = window.innerWidth / window.innerHeight;

    var xDist = pt2.x - pt1.x;
    var yDist = pt2.y * ratio - pt1.y * ratio;
    
    return Math.sqrt((xDist * xDist) + (yDist * yDist));
}

// Ajoute un point aléatoire
function add_point(choose)
{
    var newX = Math.random() * 96 + 2; // Pourcentage entre 2 et 98 pour ne pas coller les bords
    var newY = Math.random() * 96 + 2;

    var pt = new Point(newX, newY, choose);

    return pt;
}

// Vérifie que le point ne se superpose pas avec le score
function check_point_score(pt)
{
    if(pt.x < 10 && pt.y < 20)
    {
        return false;
    }
    return true;
}

function check_point_back(pt)
{
    if(pt.x < 20 && pt.y > 80)
    {
        return false;
    }
    return true;
}

//Vérfie l'emplacement des points
function check_points(arrPoints)
{
    var check = 0;
    var length = arrPoints.length;
    var xCheck = arrPoints[length-1].x;
    var yCheck = arrPoints[length-1].y;

    if(!check_point_score(arrPoints[length-1]) || !check_point_back(arrPoints[length-1]))
    {
        check = 2; // on force le false car le point est superposé sur le score
    }
    else
    {
        for(var i=0; i < length-1; i++)
        {
            if(arrPoints[i].x >= xCheck-3 && arrPoints[i].x <= xCheck+3)
            {
                check++;
            }
            if(arrPoints[i].y >= yCheck-3 && arrPoints[i].y <= yCheck+3)
            {
                check++;
            }
        } 
    }

    return (check < 2);
}

// Initialise les points au début
function init_points()
{
    var arrPoints = []
    for (var i=0; i < nbPoints; i++) 
    {
        do{
            if(i==0)
            {
                arrPoints[i] = add_point(0);
            }
            else
            {
                arrPoints[i] = add_point(1);
            }
        }while(!check_points(arrPoints));
    }
    return arrPoints;
}

// Affiche les points à l'écran
function str_point(arrPoints)
{
    var length = arrPoints.length;
    var str = ""

    //console.log(arrPoints);

    for(var i=0; i < nbPoints; i++)
    {

        var xPrint = arrPoints[i].x;
        var yPrint = arrPoints[i].y;
        var choose = arrPoints[i].isChoose;
        switch(choose) {
        case 0 :
            str += "<div class=\"point courant\" style=\"top:" + xPrint + "%; left:" + yPrint + "%\" id=\"" + i + "\"></div>";
            break;
        case 1 :
            str += "<div class=\"point\" style=\"top:" + xPrint + "%; left:" + yPrint + "%\" id=\"" + i + "\"></div>";
            break;
        case 2 :
            str += "<div class=\"point erreur\" style=\"top:" + xPrint + "%; left:" + yPrint + "%\" id=\"" + i + "\"></div>";
            break;
        case 3 :
            str += "<div class=\"point correct\" style=\"top:" + xPrint + "%; left:" + yPrint + "%\" id=\"" + i + "\"></div>";
            break;
        }
    }

    return str;
}
//Un point : <div class="point" style="top=x; left=y"></div>

function str_score(score, step)
{
    return "<p> Distance : " + score + "px - Etapes : " + step + "</p>" ;
}

function send_request() 
{
    var xhttp = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"); 
    /*xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            reponse.innerHTML = "<p>" + this.responseText.replace(/\n/g,"</p><p>") + "</p>";
        }
    }*/
    xhttp.open("get", "test.txt", true);
    return xhttp.send();
}

function str_highscores()
{
    var res = "<div id=\"highscores\"><h2>Top 10</h2><table><tr><th>Rang</th><th>Joueur</th><th>Distance</th><th>Etapes</th></tr>";
    var stock = localStorage.getItem('resultats');
    if(stock == null)
    {
        localStorage.setItem('resultats', '');
    }
    else
    {
        stock = stock.split("/");
        //console.log(stock.length);
        for (var i=0; i < stock.length-1; i++)
        {
            //console.log(i + " ");
            if((i)%4 == 0 && i != 0)
            {
                res += "</tr><tr><th>" + stock[i] + "</th>";
            }
            else if(i==0)
            {
                res += "<tr><th>" + stock[i] + "</th>";
            }
            else
            {
                res += "<th>" + stock[i] + "</th>";
            }
        }
    }
    res += "</tr>";
    res +="</table><button onclick=\"location.reload()\">Recommencer</button></div>";
    return res;
}

function prnt_str(str)
{
    document.body.innerHTML = "<a class=\"back\" href=\"https://projets.thomascorcoral.netheberg.fr/\">Retour à l'accueil</a>" + str;
}