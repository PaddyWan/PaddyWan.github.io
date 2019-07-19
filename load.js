//todo use the new array species and class

var model;
var engine;

function create_div(options)
{
    var div = document.createElement('div');
    for(var k in options)
    {
	if(Object.prototype.hasOwnProperty.call(options, k))
	{
	    div[k] = options[k];
	}
    }
    return div;
}
function add_img(div, src, className)
{	
    var img = document.createElement('img');
    if(className)
    {
	img.className = className;
    }
    img.src = src;
    div.appendChild(img);
    return div;
}

function clear_div(div)
{
    while(div.firstChild)
    {
	div.removeChild(div.firstChild);
    }
}

class Unit
{
    constructor(json)
    {
	this.name = json.name;
	this.shor = json['short'];
	this.cost = json.cost;
	this.species = [];
	for(var i = 0; i < json.species.length; ++i)
	{
	    this.species[i] = json.species[i]
	}
	this.clazz = [];
	for(var i = 0; i < json['class'].length; ++i)
	{
	    this.clazz[i] = json['class'][i]
	}
    }
    get_tr()
    {
	this.rowtxt = document.createElement('tr');
	this.rowtxt.onclick = function(unit){ return function(){model.activate_unit(unit);}; }(this.name);
	this.nametxt = document.createElement('td');
	this.nametxt.appendChild(create_div({className: 'items-item-label', innerText: this.name}));
	this.rowtxt.appendChild(this.nametxt);
	
	var tdspecies = document.createElement('td');
	this.speciestxt = [];
	for(var i = 0; i < this.species.length; ++i)
	{
	    this.speciestxt[i] = document.createElement('div');
	    this.speciestxt[i].className = 'items-item-icons';
	    this.speciestxt[i].appendChild(document.createTextNode('...'));
	    add_img(this.speciestxt[i], 'icon/'+this.species[i]+'.png');
	    this.speciestxt[i].appendChild(document.createTextNode('...'));
	    tdspecies.appendChild(this.speciestxt[i]);
	}
	this.rowtxt.appendChild(tdspecies);
	
	var tdclazz = document.createElement('td');
	this.clazztxt = [];
	for(var i = 0; i < this.clazz.length; ++i)
	{
	    this.clazztxt[i] = document.createElement('div');
	    this.clazztxt[i].className = 'items-item-icons';
	    this.clazztxt[i].appendChild(document.createTextNode('...'));
	    add_img(this.clazztxt[i], 'icon/'+this.clazz[i]+'.png');
	    this.clazztxt[i].appendChild(document.createTextNode('...'));
	    tdclazz.appendChild(this.clazztxt[i]);
	}
	this.rowtxt.appendChild(tdclazz);
	return this.rowtxt;
    }
    highlight(units,species,clazz)
    {
	if(units.indexOf(this.name) !== -1)
	{//select row
	    this.nametxt.classList.add('highlighted');
	}
	else
	{
	    this.nametxt.classList.remove('highlighted');
	}
	for(var i = 0; i < this.species.length; ++i)
	{
	    if(species.indexOf(this.species[i]) !== -1)
	    {//select species
		this.speciestxt[i].classList.add('highlighted');
	    }
	    else
	    {
		this.speciestxt[i].classList.remove('highlighted');
	    }
	}
	for(var i = 0; i < this.clazz.length; ++i)
	{
	    if(clazz.indexOf(this.clazz[i]) !== -1)
	    {//select class
		this.clazztxt[i].classList.add('highlighted');
	    }
	    else
	    {
		this.clazztxt[i].classList.remove('highlighted');
	    }
	}
    }
}

class Engine
{
    constructor(json)
    {
	this.units = [];
	for(var i = 0; i < json.units.length; i++)
	{
	    this.units[i] = new Unit(json.units[i]);
	}
	{//build page
	    document.getElementById('app').className = 'app-container';
	    var divid = document.createElement('div');
	    divid.className = 'selection-stats';
	    var table = document.createElement('table');
	    this.speciesclazz = document.createElement('tbody');
	    table.appendChild(this.speciesclazz);
	    divid.appendChild(table);
	    document.getElementById('app').appendChild(divid);
		
	    var divid = document.createElement('div');
	    divid.className = 'items-column';
	    var table = document.createElement('table');
	    var tbody = document.createElement('tbody');
	    var cost = 1;
	    for(var i = 0; i < json.units.length; i++)
	    {
		if(json.units[i].cost != cost)
		{
		    cost++;
		    table.appendChild(tbody);
		    divid.appendChild(table);
		    document.getElementById('app').appendChild(divid);
		    divid = document.createElement('div');
		    divid.className = 'items-column';
		    table = document.createElement('table');
		    tbody = document.createElement('tbody');
		}
		tbody.appendChild(this.units[i].get_tr());
	    }
	    table.appendChild(tbody);
	    divid.appendChild(table);
	    document.getElementById('app').appendChild(divid);
	}
    }
    highlight(units,species,clazz)
    {
	clear_div(this.speciesclazz);
	for(var i = 0; i < this.units.length; i++)
	{
	    this.units[i].highlight(units,species,clazz);
	}
	{
	    var tr = document.createElement('tr');
	    this.speciesclazz.appendChild(tr);
	    
	    var td1 = document.createElement('td');
	    tr.appendChild(td1);
	    td1.className = 'selection-stats-key';
	    td1.innerText = 'Number of units:';
	    
	    var td2 = document.createElement('td');
	    tr.appendChild(td2);
	    td2.className = 'selection-stats-value';
	    td2.innerText = units.length;
	}
	var tempspecies = [];
	var tempclazz = [];
	for(var i = 0; i < species.length; i++)
	{
	    var j = 0;
	    while(j < tempspecies.length && tempspecies[j].species !== species[i])
	    {
		j++;
	    }
	    if(j === tempspecies.length)
	    {
		tempspecies[j] = {species:species[i], count:1};
	    }
	    else
	    {
		tempspecies[j].count++;
	    }
	}
	for(var i = 0; i < tempspecies.length; i++)
	{
	    var tr = document.createElement('tr');
	    this.speciesclazz.appendChild(tr);
	    
	    var td1 = document.createElement('td');
	    tr.appendChild(td1);
	    var item = document.createElement('div');
	    td1.appendChild(item);
	    item.className = 'selection-stats-item';
	    add_img(item, 'icon/'+tempspecies[i].species+'.png', 'selection-stats-item-icon');
	    var itemlabel = document.createElement('span');
	    item.appendChild(itemlabel);
	    itemlabel.className = 'selection-stats-item-label';
	    itemlabel.innerText = tempspecies[i].species;
	    
	    var td2 = document.createElement('td');
	    tr.appendChild(td2);
	    var itemcount = document.createElement('div');
	    td2.appendChild(itemcount);
	    itemcount.className = 'selection-stats-itemcount';
	    itemcount.innerText = tempspecies[i].count;
	}
	for(var i = 0; i < clazz.length; i++)
	{
	    var j = 0;
	    while(j < tempclazz.length && tempclazz[j].clazz !== clazz[i])
	    {
		j++;
	    }
	    if(j === tempclazz.length)
	    {
		tempclazz[j] = {clazz:clazz[i], count:1};
	    }
	    else
	    {
		tempclazz[j].count++;
	    }
	}
	for(var i = 0; i < tempclazz.length; i++)
	{
	    var tr = document.createElement('tr');
	    this.speciesclazz.appendChild(tr);
	    
	    var td1 = document.createElement('td');
	    tr.appendChild(td1);
	    var item = document.createElement('div');
	    td1.appendChild(item);
	    item.className = 'selection-stats-item';
	    add_img(item, 'icon/'+tempclazz[i].clazz+'.png', 'selection-stats-item-icon');
	    var itemlabel = document.createElement('div');
	    item.appendChild(itemlabel);
	    itemlabel.className = 'selection-stats-item-label';
	    itemlabel.innerText = tempclazz[i].clazz;
	    
	    var td2 = document.createElement('td');
	    tr.appendChild(td2);
	    var itemcount = document.createElement('div');
	    td2.appendChild(itemcount);
	    itemcount.className = 'selection-stats-itemcount';
	    itemcount.innerText = tempclazz[i].count;
	}
	{//hash
	    var shortunits = [];
	    for(var i = 0; i < units.length; i++)
	    {
		var un = this.get_unit(units[i]);
		if(un !== null)
		{
		    shortunits[i] = un.shor;
		}
	    }
	    shortunits.sort();
	    window.location.hash='#'+shortunits.join('');
	}
    }
    get_unit(unit)
    {
	var i = 0;
	while(i < this.units.length && this.units[i].name !== unit)
	{
	    i++;
	}
	if(i === this.units.length)
	{
	    return null;
	}
	else
	{
	    return this.units[i];
	}
    }
    get_short_unit(shor)
    {
	var i = 0;
	while(i < this.units.length && this.units[i].shor !== shor)
	{
	    i++;
	}
	if(i === this.units.length)
	{
	    return null;
	}
	else
	{
	    return this.units[i];
	}
    }
    
}

class Model
{
    constructor()
    {
	this.units = [];
	this.species = [];
	this.clazz = [];
    }
    add_unit(unit)
    {
	var i = 0;
	while(i < engine.units.length && engine.units[i].name !== unit)
	{
	    ++i;
	}
	this.units[this.units.length] = unit;
	for(var j = 0; j < engine.units[i].species.length; ++j)
	{
	    this.species[this.species.length] = engine.units[i].species[j];
	}
	for(var j = 0; j < engine.units[i].clazz.length; ++j)
	{
	    this.clazz[this.clazz.length] = engine.units[i].clazz[j];
	}
    }
    activate_unit(unit)
    {
	var index = this.units.indexOf(unit);
	if(index === -1)
	{
	    this.add_unit(unit);
	}
	else
	{
	    this.units[index] = this.units[this.units.length-1];
	    this.units.pop();
	    var tempunits = this.units;
	    this.units = [];
	    this.species = [];
	    this.clazz = [];
	    for(var i = 0; i < tempunits.length; i++)
	    {
		this.add_unit(tempunits[i]);
	    }
	}
	engine.highlight(this.units,this.species,this.clazz);
    }
}

function init()
{
    var hash = window.location.hash.substr(1);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
	{
	    var json = JSON.parse(xmlhttp.responseText);
	    model = new Model();
	    engine = new Engine(json);
	    while(hash !== undefined && hash.length>=2)
	    {
		var un = engine.get_short_unit(hash.substr(0,2));
		if(un !== null)
		{
		    model.add_unit(un.name);
		}
		hash=hash.substr(2);		
	    }
	    engine.highlight(model.units,model.species,model.clazz);
	    if(typeof undefined !== 'undefined')
	    {
		alert('alert');
	    }
        }
    };
    xmlhttp.open('GET', 'data.json?t=' + Date.now(), true);
    xmlhttp.send();
}

window.onload = init;
