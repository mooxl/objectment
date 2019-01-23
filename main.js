function Rectangle(length, width, name) {
    if (name) {
        this.name = name;
    } else {
        this.name = 'rectangle';
    }
    this.length = length;
    this.width = width;
}
Rectangle.prototype.getArea = function () {
    return this.length + this.width;
};
Rectangle.prototype.toString = function () {
    return "[Rectangle " + this.length + "x" + this.width + "]";
};

function Square(size) {
    Rectangle.call(this, size, size, 'square');
}
Square.prototype = new Rectangle();
Square.prototype.constructor = Square;
Square.prototype.toString = function () {
    return "[Square " + this.length + "x" + this.width + "]";
};

function Result(self, name, properties, id, childOf) {
    this.self = self;
    this.id = id;
    this.name = name;
    this.properties = properties;
    this.childOf = childOf;
}

var rectangle = new Rectangle(5, 10);
var square = new Square(6);
var objects = [rectangle, square];
var nodes = [];
var edges = [];
var results = [];
var result, prototype, counter;


(function walkThroughObjects(objects) {
    counter = 0;
    objects.forEach(function (object) {
        counter += Object.getOwnPropertyNames(object).length + 1;
        result = new Result(object, object.name, Object.getOwnPropertyNames(object), counter, object.constructor.name);
        results[object.name] = result;
        while (object.constructor.name !== 'Object') {
            object = Object.getPrototypeOf(object);
            if (object.constructor.name !== 'Object') {
                prototype = Object.getPrototypeOf(object);
            }
            counter += Object.getOwnPropertyNames(object).length + 1;
            result = new Result(object, object.constructor.name, Object.getOwnPropertyNames(object), counter, prototype.constructor.name);
            results[object.constructor.name] = result;
        }
    });
    connectThem();
    addItemsToVis();
})(objects);

function connectThem() {
    for (var object in results){
        if (results[object].name !== results[object].childOf){
            results[object].childOf = results[results[object].childOf].id;
        }
    }
}

function addItemsToVis() {
    for (var object in results) {
        counter = results[object].id;
        nodes.push({
            id: results[object].id,
            label: results[object].name
        });
        edges.push({
            from: results[object].id,
            to: results[object].childOf
        }); 
        results[object].properties.forEach(function(property){
            counter--;
            nodes.push({
                id: counter,
                label: property
            });
            edges.push({
                from: counter,
                to: results[object].id
            }); 
        });
    }
    nodes = new vis.DataSet(nodes);
    edges = new vis.DataSet(edges);
}
var container = document.querySelector('.wrapper');
var data = {
    nodes: nodes,
    edges: edges,
};
var options = {
    nodes: {
        borderWidth: 0,
        color: '#4b6584',
        font: {
            color: '#ecf0f1',
            size: 16,
        },
        shape: 'box',
    }
};
var network = new vis.Network(container, data, options);