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
function get_other_short_name(dict, name)
{
    for(var i = 0; i < name.length; ++i)
    {
	for(var j = 0; j < name.length; ++j)
	{
	    if(!dict.hasOwnProperty(name.charAt(i)+name.charAt(j)))
	    {
		return name.charAt(i)+name.charAt(j);
	    }
	}
    }
    var i = 0;
    var attempt = ('0'+(i.toString(36))).slice(-2);
    while(i<36*36 && dict.hasOwnPropeerty(attempt))
    {
	++i;
	attempt = ('0'+(i.toString(36))).slice(-2);
    }
    if(i < 36*36)
	return attempt;
    return '"XX';
}

class Unit
{
    constructor(json)
    {
	this.name = json.name;
	this.cost = json.cost;
	this.alliance = [];
	for(var i = 0; i < json.alliance.length; ++i)
	{
	    this.alliance[i] = json.alliance[i]
	}
    }
    get_tr()
    {
	this.rowtxt = document.createElement('tr');
	this.rowtxt.onclick = function(unit){ return function(){model.activate_unit(unit);}; }(this.name);
	this.nametxt = document.createElement('td');
	this.nametxt.appendChild(create_div({className: 'items-item-label', innerText: this.name}));
	this.rowtxt.appendChild(this.nametxt);
	
	var tdalliance = document.createElement('td');
	var tddivalliance = document.createElement('div');
	tddivalliance.className='horizontal-alliance';
	this.alliancetxt = [];
	for(var i = 0; i < this.alliance.length; ++i)
	{
	    this.alliancetxt[i] = document.createElement('div');
	    this.alliancetxt[i].className = 'items-item-icons';
	    add_img(this.alliancetxt[i], 'icon/'+this.alliance[i]+'.png');
	    tddivalliance.appendChild(this.alliancetxt[i]);
	}
	tdalliance.appendChild(tddivalliance);
	this.rowtxt.appendChild(tdalliance);
	return this.rowtxt;
    }
    highlight(units,alliance)
    {
	if(units.indexOf(this.name) !== -1)
	{//select row
	    this.nametxt.classList.add('highlighted');
	}
	else
	{
	    this.nametxt.classList.remove('highlighted');
	}
	for(var i = 0; i < this.alliance.length; ++i)
	{
	    if(alliance.indexOf(this.alliance[i]) !== -1)
	    {//select alliance
		this.alliancetxt[i].classList.add('highlighted');
	    }
	    else
	    {
		this.alliancetxt[i].classList.remove('highlighted');
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
	this.make_unique_short_names();
	this.sort_units_on_cost();
	this.delete_zero_cost();
	{//build page
	    document.getElementById('app').className = 'app-container';
	    var divid = document.createElement('div');
	    divid.className = 'selection-stats';
	    var table = document.createElement('table');
	    this.alliance = document.createElement('tbody');
	    table.appendChild(this.alliance);
	    divid.appendChild(table);
	    document.getElementById('app').appendChild(divid);
		
	    var divid = document.createElement('div');
	    divid.className = 'items-column';
	    var table = document.createElement('table');
	    var tbody = document.createElement('tbody');
	    var cost = 1;
	    for(var i = 0; i < this.units.length; i++)
	    {
		if(this.units[i].cost != cost)
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
    highlight(units,alliance)
    {
	clear_div(this.alliance);
	for(var i = 0; i < this.units.length; i++)
	{
	    this.units[i].highlight(units,alliance);
	}
	{
	    var tr = document.createElement('tr');
	    this.alliance.appendChild(tr);
	    
	    var td1 = document.createElement('td');
	    tr.appendChild(td1);
	    td1.className = 'selection-stats-key';
	    td1.innerText = 'Number of units:';
	    
	    var td2 = document.createElement('td');
	    tr.appendChild(td2);
	    td2.className = 'selection-stats-value';
	    td2.innerText = units.length;
	}
	var tempalliance = [];
	for(var i = 0; i < alliance.length; i++)
	{
	    var j = 0;
	    while(j < tempalliance.length && tempalliance[j].alliance !== alliance[i])
	    {
		j++;
	    }
	    if(j === tempalliance.length)
	    {
		tempalliance[j] = {alliance:alliance[i], count:1};
	    }
	    else
	    {
		tempalliance[j].count++;
	    }
	}
	for(var i = 0; i < tempalliance.length; i++)
	{
	    var tr = document.createElement('tr');
	    this.alliance.appendChild(tr);
	    
	    var td1 = document.createElement('td');
	    tr.appendChild(td1);
	    var item = document.createElement('div');
	    td1.appendChild(item);
	    item.className = 'selection-stats-item';
	    add_img(item, 'icon/'+tempalliance[i].alliance+'.png', 'selection-stats-item-icon');
	    var itemlabel = document.createElement('span');
	    item.appendChild(itemlabel);
	    itemlabel.className = 'selection-stats-item-label';
	    itemlabel.innerText = tempalliance[i].alliance;
	    
	    var td2 = document.createElement('td');
	    tr.appendChild(td2);
	    var itemcount = document.createElement('div');
	    td2.appendChild(itemcount);
	    itemcount.className = 'selection-stats-itemcount';
	    itemcount.innerText = tempalliance[i].count;
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
    sort_units_on_cost()
    {
	this.units.sort(function(a,b)
			{
			    if(a.cost == b.cost)
				return a.name > b.name;
			    else
				return a.cost > b.cost;
			});
    }
    make_unique_short_names()
    {	
	this.units.sort(function(a,b)
			{
			    return a.name > b.name;
			});
	for(var i = 0; i < this.units.length; ++i)
	{
	    this.units[i].tempname=this.units[i].name.toLowerCase().replace(/\s|-|_/g, '');;	    
	}
	var dict = {};
	for(var i = 0; i < this.units.length; ++i)
	{
	    var attempt = this.units[i].tempname.slice(0,2);
	    if(!dict.hasOwnProperty(attempt))
	    {
		this.units[i].shor=attempt;
		dict[attempt] = true;
	    }
	    
	}
	for(var i = 0; i < this.units.length; ++i)
	{
	    if(!this.units[i].hasOwnProperty('shor'))
	    {
		this.units[i].shor=get_other_short_name(dict, this.units[i].tempname);
		dict[this.units[i].shor] = true;
	    }
	    delete this.units[i].tempname;
	}
    }
    delete_zero_cost()
    {
	while(this.units[0].cost == 0)
	    this.units.shift();
    }
}

class Model
{
    constructor()
    {
	this.units = [];
	this.alliance = [];
    }
    add_unit(unit)
    {
	var i = 0;
	while(i < engine.units.length && engine.units[i].name !== unit)
	{
	    ++i;
	}
	this.units[this.units.length] = unit;
	for(var j = 0; j < engine.units[i].alliance.length; ++j)
	{
	    this.alliance[this.alliance.length] = engine.units[i].alliance[j];
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
	    this.alliance = [];
	    for(var i = 0; i < tempunits.length; i++)
	    {
		this.add_unit(tempunits[i]);
	    }
	}
	engine.highlight(this.units,this.alliance);
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
	    engine.highlight(model.units,model.alliance);
	    if(typeof undefined !== 'undefined')
	    {
		alert('alert');
	    }
        }
    };
    var url = new URL(window.location.href);
    var version = url.searchParams.get('v');
    if(!version)
    {    
	xmlhttp.open('GET', 'latest.json?t=' + Date.now(), true);
    }
    else
    {
	xmlhttp.open('GET', version + '.json', true);
    }
    xmlhttp.send();
}

window.onload = init;
