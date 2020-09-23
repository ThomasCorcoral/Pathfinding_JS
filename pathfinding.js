// Convention nommage : - Var minuscule puis majuscule à chaque nouveau mot
//                      - Fonction Pas de majuscule, underscore entre chaque mot
//                      - Object majuscule au début 

const nbPoints = 10;

class Point {   // classe définissant un point
    constructor (xCoord, yCoord, choose, id) {
        this.x = xCoord;    
        this.y = yCoord;
        this.isChoose = choose; // chaine de caractère donnant la classe du point
        this.div = document.createElement("div");   // On ajoute le div représentant le point
        document.body.appendChild(this.div);
        this.div.id = id;
    }
    
    update(id) // permet de modifier un point Par exemple quand on génère un nouveau point on va en fait seulement regénérer de nouvelles coordonées
    {
        var div = document.getElementById(id);
        div.className = this.isChoose;
        div.style.top = this.x + "%";
        div.style.left = this.y + "%";
        div.id = id;
    }

    change(xChange, yChange, newChoose) // Fonction permettant de changer les coordonées et la classe d'un point
    {
        this.x = xChange;
        this.y = yChange;
        this.isChoose = newChoose;
    }
}

window.onload = function(){
    main();
}

function main(){
    var score = 0;
    var toPrint = "";
    var step = 0;
    var save_score = 0;
    if(sessionStorage.getItem("Background") == null ){ // Initialisation du background
        sessionStorage.setItem("Background","White");
    }
    set_background();

    var arrPoints = init_points(); // Initialisation du tableau de points.

    var hr = document.createElement("hr");  // Initialisation du trait (hr) entre les points sélectionnés
    document.body.appendChild(hr);

    var divScore = document.createElement("div"); // Initialisation du score.
    document.body.appendChild(divScore);
    divScore.innerHTML = "Distance : " + score + "px - Etapes : " + step;

    for(var i = 0; i < nbPoints; i++) // On parcours tous les points
    {
        arrPoints[i].div.addEventListener('click', function (event){ // Listener pour les cliques
            if(score != -1)
            {
                step++;
                save_score = score;
                score = click_checker(event.target.id, arrPoints, score);
                if(score == -1){
                    var closest = closest_point(arrPoints);
                    put_error(arrPoints[event.target.id], arrPoints[closest], closest , event.target.id);
                    alert("Perdu !");
                    show_highscore();
                    var rank = check_top_ten(save_score)
                    if(rank <= 10 ){
                        var name = window.prompt("Entrez votre nom : ");
                        var toStore = rank + "/" + name + "/" + save_score + "/" + step + "/";
                        localStorage.setItem('resultats', localStorage.getItem('resultats') + ' ' + toStore);
                        sort_storage();
                    }
                }
                else{
                    update_all(arrPoints, divScore, score, step, hr);
                }
            }
        });

        arrPoints[i].div.addEventListener('mouseover', function (event){ // Listener pour l'entrée de la souris sur un point 
            str_hr(arrPoints, event.target.id, hr);
        });
    }
}

/** 
 * Gère l'affichage du point correcte en vert et
 * du point d'erreur en rouge lors de la défaite 
 * du joueur.
 *
 * @param  Point   err           Point erreur
 * @param  Point   correct       Point correcte
 * @param  int     idCorrect     id du point correcte  
 * @param  int     idErr         id du point erreur  
 */
function put_error(err, correct, idCorrect, idErr)
{
    correct.isChoose = "point correct";
    correct.update(idCorrect);
    err.isChoose = "point erreur";
    err.update(idErr);
}

/** 
 * Fonction, permettant de supprimer tous les
 * points. Cette fonction n'est pas utilisée dans
 * ce programme mais elle pourrait éventuellement 
 * s'avérer utile.
 */
function remove_points()
{
    for(var i = 0; i<nbPoints; i++)
    {
        document.body.removeChild(document.getElementById(i));
    }
}

/** 
 * Mise à jour des différents points et également
 * de l'affichage du score.
 *
 * @param  array   arrPoints   Tableau de points
 * @param  element divScore    div contenant le score  
 * @param  int     score       score du joueur  
 * @param  int     step        Nombre de cliques effectués par l'utilisateur  
 */
function update_all(arrPoints, divScore, score, step)
{
    for(var i = 0; i < nbPoints; i++)
    {
        arrPoints[i].update(i);
    }
    divScore.innerHTML = "Distance : " + score + "px - Etapes : " + step;
}

/** 
 * Vérifie que le point ne se superpose pas avec le score
 *
 * @param  int   x      Coordonées en x à vérifier
 * @param  int   y      Coordonées en y à vérifier
 */
function check_point_score(x, y){
    return !(x < 10 && y < 20);
}

/** 
 * Vérifie que le point est bien positionné sur la
 * page
 *
 * @param  array   arrPoints      Tableau de points
 * @param  int     xCheck         Coordonées en x à vérifier
 * @param  int     yCheck         Coordonées en y à vérifier
 * @param  int     id             id du point à vérifier (-1 par défaut)
 */
function check_points(arrPoints, xCheck, yCheck, id = -1)
{
    var check = 0;
    var length = arrPoints.length;
    //console.log(length);
    if(!check_point_score(xCheck, yCheck)){
        check = 2; // on force le false car le point est superposé sur le score
    }
    else{
        for(var i=0; i < length; i++){
            if(id != i)
            {
                //console.log("indice : " + i + " / id : " + id);
                if(arrPoints[i].x >= xCheck-3 && arrPoints[i].x <= xCheck+3){
                    check++;
                }
                if(arrPoints[i].y >= yCheck-3 && arrPoints[i].y <= yCheck+3){
                    check++;
                }
            }
        } 
    }
    //console.log("check : " + check);
    if(id != -1)
    {
        return (check <  4);
    }
    return (check < 2);
}

/** 
 * Ajoute un point aléatoire
 *
 * @param  array     arrPoints     Tableau de points
 * @param  string    choose        Classe du point à ajouter 
 * @param  int       id            id du point
 */
function add_point(arrPoints, choose, id){
    do{
        var newX = Math.random() * 96 + 2; // Pourcentage entre 2 et 98 pour ne pas coller les bords
        var newY = Math.random() * 96 + 2;
    }while(!check_points(arrPoints, newX, newY));
    var pt = new Point(newX, newY, choose, id);
    return pt;
}

/** 
 * Initialise les points au début
 */
function init_points()
{
    var arrPoints = []
    for (var i=0; i < nbPoints; i++){
        if(i==0){
            arrPoints[i] = add_point(arrPoints, "point courant", i);
        }
        else{
            arrPoints[i] = add_point(arrPoints, "point", i);
        }
        arrPoints[i].update(i);
    }
    return arrPoints;
}

document.addEventListener("keypress", function(e) {
    //On aurait pu utiliser e.which mais which est obsolète.
    if(e.key == "d"){
        if(sessionStorage.getItem("Background") == "White"){
            sessionStorage.setItem("Background","Black");
        }
        else{
            sessionStorage.setItem("Background","White");
        }
        set_background();
    }
});

/**
 * Fonction qui permet de mettre à jour le point
 * grace à son id. Génère automatiquement un 
 * nouveau point
 * 
 * @param  int       id            id du point
 * @param  array     arrPoints     Tableau de points
 * 
 * @return arrPoints    tableau de points modifié
 */
function update_points(id, arrPoints){
    arrPoints[0].change(arrPoints[id].x, arrPoints[id].y, "point courant");
    change_point(arrPoints, id);
    return arrPoints;
}

/**
 * Fonction qui permet de mettre à jour un point
 * en générant aléatoirement des coordonnées
 * comprises entre 2% et 98%
 * 
 * @param  array     arrPoints     Tableau de points
 * @param  int       id            id du point
 */
function change_point(arrPoints, id)
{
    do{
        var newX = Math.random() * 96 + 2; // Pourcentage entre 2 et 98 pour ne pas coller les bords
        var newY = Math.random() * 96 + 2;
        arrPoints[id].change(newX, newY, "point");
    }while(!check_points(arrPoints, newX, newY, id));
}

/**
 * Vérifie que le point choisi n'est pas le point courant
 * S'il ne l'est pas, on vérifie que ce point est bien le
 * plus proche et on execute les fonctions correspondantes.
 * Sinon on passe score à -1
 * 
 * @param  int       id            id du point
 * @param  array     arrPoints     Tableau de points
 * @param  int       score         Score actuel du joueur
 * 
 * @return  score    Nouveau score après le coup du joueur
 */
function click_checker(id, arrPoints, score)
{
    if(id == 0){
        alert("Merci de bien vouloir choisir un autre point");
    }
    else{
        var closer = closest_point(arrPoints);
        if(closer == id){
            var points = distance(arrPoints[0], arrPoints[closer]);
            var ratio = window.innerWidth / window.innerHeight;
            score += Math.floor(points * ratio);
            arrPoints = update_points(id, arrPoints);
        }
        else{
            score = -1;
        }
    }
    return score;
}

/**
 * Met à jour la barre de liaison entre le point 
 * courant et le point sur lequel la souris
 * passe
 * 
 * @param  int       id            id du point
 * @param  array     arrPoints     Tableau de points
 * @param  element   hr            ligne reliant deux points
 */
function str_hr(arrPoints, id, hr)
{
    window.innerWidth / window.innerHeight;
    var x1 = arrPoints[0].x * window.innerHeight / 100;
    var x2 = arrPoints[id].x * window.innerHeight / 100;
    var y1 = arrPoints[0].y * window.innerWidth / 100;
    var y2 = arrPoints[id].y * window.innerWidth / 100;
    var xlen = Math.abs(x2 - x1);
    var ylen = Math.abs(y2 - y1);
    var len = Math.sqrt(Math.pow(xlen, 2) + Math.pow(ylen, 2));
    var angle = Math.atan(ylen / xlen) * 180 / Math.PI;;
    if( y2 < y1){ // A Gauche
        if(x2 < x1){ // En haut
            angle = 90 - angle + 180;
        }
        else{ // En bas
            angle += 90;
        }
    }
    else{ //A Droite
        if(x2 < x1){ // En Haut
            angle += 270;
        }
        else{ // En Bas
            angle = 90 - angle;
        }
    }
    hr.style.width = len + "px";
    hr.style.top = x1 + "px";
    hr.style.left = y1 + "px";
    hr.style.transform = "rotate(" + angle + "deg)";
}

/**
 * Fonction qui vérifie si je joueur est dans le
 * top 10 et retourne son rang
 * 
 * @param  int       score        score du joueur
 * 
 * @return rank    retourne le rang du joueur
 */
function check_top_ten(score)
{
    var rank = 1;
    var res = localStorage.getItem('resultats');
    if(res != null){
        var i = 3;
        res = res.split("/");
        do{
            if(res[i] > score){
                rank++;
                
                console.log("rank = " + rank);
            }
            console.log("i : " + i);
            i+=4;
        }while(i < res.length);
    }
    return rank;
}

/**
 * Fonction qui permet de récupérer le tableau
 * des résultats non trié tel qu'il est stocké
 * 
 * @return toSort    tableau des résultats non trié
 */
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

/**
 * Permet de trier le tableau des résultats et 
 * de le stocker sous le nom resultats
 */
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
    if(toSort.length >= 10){
        length = 10;
    }
    else{
        length = toSort.length;
    }

    for (var i=0; i < length; i++){
        index = res.indexOf(toSort[i]);
        rank++;
        new_res += rank + "/" + res[index-1] + "/" + res[index] + "/" + res[index+1] + "/";
    }
    localStorage.setItem('resultats', new_res);
}

/**
 * Prend en argument le tableau des points et retourne
 * l'id du point le plus proche
 * 
 * @param  array     arrPoints     Tableau de points
 * 
 * @return id    id du point le plus proche
 */
function closest_point(arrPoints){
    var dist = distance(arrPoints[0], arrPoints[1]);
    var id = 1;
    for (var i=2; i < nbPoints; i++){
        var newDist = distance(arrPoints[0], arrPoints[i]);
        if(dist > newDist){
            dist = newDist;
            id = i;
        }
    }
    return id;
}

/**
 * Initialise le background ou le modifie en fonction
 * de la valeur de l'item Background.
 */
function set_background(){
    if(sessionStorage.getItem("Background") == "White"){
        document.body.className = "";
    }
    else{
        document.body.className = "darkmode";
    }
}


/**
 * Calcul la distance entre deux points
 * 
 * @param  int    pt1     Premier point
 * @param  int    pt2     Second point
 * 
 * @return int    distance entre les deux points
 */
function distance(pt1, pt2){
    var ratio = window.innerWidth / window.innerHeight;

    var xDist = pt2.x - pt1.x;
    var yDist = pt2.y * ratio - pt1.y * ratio;
    
    return Math.sqrt((xDist * xDist) + (yDist * yDist));
}

/**
 * Fonction qui permet d'afficher le tableau des 
 * meilleurs scores.
 */
function show_highscore(){
    var divHighScore = document.createElement("div");
    document.body.appendChild(divHighScore);
    divHighScore.id = "highscores";
    var h2 = document.createElement("h2");
    h2.innerHTML = "Top 10";
    divHighScore.appendChild(h2);
    var table = document.createElement("table");
    divHighScore.appendChild(table);
    var tr = document.createElement("tr");
    table.appendChild(tr);
    var th = document.createElement("th");
    th.innerHTML = "Rang";
    tr.appendChild(th);
    th = document.createElement("th");
    th.innerHTML = "Joueur";
    tr.appendChild(th);
    th = document.createElement("th");
    th.innerHTML = "Distance";
    tr.appendChild(th);
    th = document.createElement("th");
    th.innerHTML = "Etapes";
    tr.appendChild(th);

    var stock = localStorage.getItem('resultats');
    if(stock == null){
        localStorage.setItem('resultats', '');
    }
    else{
        stock = stock.split("/");
        for (var i=0; i < stock.length-1; i++){
            if((i)%4 == 0 || i == 0){
                tr = document.createElement("tr");
                table.appendChild(tr);
                th = document.createElement("th");
                th.innerHTML = stock[i];
                tr.appendChild(th);
            }
            else{
                th = document.createElement("th");
                th.innerHTML = stock[i];
                tr.appendChild(th)
            }
        }
    }

    var bouton = document.createElement("button");
    bouton.innerHTML = "Recommencer";
    bouton.onclick = function(event) {
        location.reload();
      }
    divHighScore.appendChild(bouton);

}