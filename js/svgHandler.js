/**
 * svgHandler.js - Handles SVG creation and manipulation
 * Provides utilities for creating and modifying SVG elements
 */

// SVG Namespace
const SVG_NS = "http://www.w3.org/2000/svg";

// Create a new SVG element
function createSVGElement(tag, attributes = {}) {
    const element = document.createElementNS(SVG_NS, tag);
    
    for (const [key, value] of Object.entries(attributes)) {
        element.setAttribute(key, value);
    }
    
    return element;
}

// Add an SVG element to a parent
function appendSVGChild(parent, childElement) {
    parent.appendChild(childElement);
    return childElement;
}

// Create a circle element
function createCircle(cx, cy, r, attributes = {}) {
    return createSVGElement('circle', {
        cx, cy, r,
        ...attributes
    });
}

// Create a rectangle element
function createRect(x, y, width, height, attributes = {}) {
    return createSVGElement('rect', {
        x, y, width, height,
        ...attributes
    });
}

// Create a text element
function createText(x, y, text, attributes = {}) {
    const textElement = createSVGElement('text', {
        x, y,
        ...attributes
    });
    
    textElement.textContent = text;
    return textElement;
}

// Create a path element
function createPath(d, attributes = {}) {
    return createSVGElement('path', {
        d,
        ...attributes
    });
}

// Create an image element
function createImage(href, x, y, width, height, attributes = {}) {
    return createSVGElement('image', {
        href, x, y, width, height,
        ...attributes
    });
}

// Create a line element
function createLine(x1, y1, x2, y2, attributes = {}) {
    return createSVGElement('line', {
        x1, y1, x2, y2,
        ...attributes
    });
}

// Create a polygon element
function createPolygon(points, attributes = {}) {
    return createSVGElement('polygon', {
        points: points.join(' '),
        ...attributes
    });
}

// Generate a simple SVG diagram
function generateDiagram(type, width, height) {
    const svg = createSVGElement('svg', {
        viewBox: `0 0 ${width} ${height}`,
        width: '100%',
        height: 'auto'
    });
    
    switch(type) {
        case 'flowchart':
            generateFlowchart(svg, width, height);
            break;
        case 'diagram':
            generateGenericDiagram(svg, width, height);
            break;
        case 'graph':
            generateGraph(svg, width, height);
            break;
    }
    
    return svg;
}

// Generate a flowchart diagram
function generateFlowchart(svg, width, height) {
    // Start node
    const startNode = createCircle(width / 2, 40, 30, {
        fill: '#6ab7ff',
        stroke: '#005cb8',
        'stroke-width': '2'
    });
    appendSVGChild(svg, startNode);
    
    // Start text
    appendSVGChild(svg, createText(width / 2, 45, 'Start', {
        'text-anchor': 'middle',
        'font-family': 'Arial',
        'font-size': '14'
    }));
    
    // Process node
    const processNode = createRect(width / 2 - 60, 100, 120, 50, {
        fill: '#a5d6a7',
        stroke: '#2e7d32',
        'stroke-width': '2',
        rx: '5'
    });
    appendSVGChild(svg, processNode);
    
    // Process text
    appendSVGChild(svg, createText(width / 2, 130, 'Process', {
        'text-anchor': 'middle',
        'font-family': 'Arial',
        'font-size': '14'
    }));
    
    // Decision node
    const decisionPoints = [
        `${width / 2},180`,
        `${width / 2 + 70},230`,
        `${width / 2},280`,
        `${width / 2 - 70},230`
    ];
    
    const decisionNode = createPolygon(decisionPoints, {
        fill: '#ffecb3',
        stroke: '#ffa000',
        'stroke-width': '2'
    });
    appendSVGChild(svg, decisionNode);
    
    // Decision text
    appendSVGChild(svg, createText(width / 2, 230, 'Decision', {
        'text-anchor': 'middle',
        'font-family': 'Arial',
        'font-size': '14'
    }));
    
    // End node
    const endNode = createCircle(width / 2, height - 40, 30, {
        fill: '#ef9a9a',
        stroke: '#c62828',
        'stroke-width': '2'
    });
    appendSVGChild(svg, endNode);
    
    // End text
    appendSVGChild(svg, createText(width / 2, height - 35, 'End', {
        'text-anchor': 'middle',
        'font-family': 'Arial',
        'font-size': '14'
    }));
    
    // Connector lines
    appendSVGChild(svg, createLine(width / 2, 70, width / 2, 100, {
        stroke: '#333',
        'stroke-width': '2'
    }));
    
    appendSVGChild(svg, createLine(width / 2, 150, width / 2, 180, {
        stroke: '#333',
        'stroke-width': '2'
    }));
    
    appendSVGChild(svg, createLine(width / 2, 280, width / 2, height - 70, {
        stroke: '#333',
        'stroke-width': '2'
    }));
}

// Generate a generic diagram
function generateGenericDiagram(svg, width, height) {
    // Background
    appendSVGChild(svg, createRect(0, 0, width, height, {
        fill: '#f5f5f5',
        stroke: 'none'
    }));
    
    // Title
    appendSVGChild(svg, createText(width / 2, 30, 'Component Diagram', {
        'text-anchor': 'middle',
        'font-family': 'Arial',
        'font-size': '18',
        'font-weight': 'bold'
    }));
    
    // Components
    const components = [
        { x: 100, y: 100, width: 150, height: 80, title: 'Component A' },
        { x: 350, y: 100, width: 150, height: 80, title: 'Component B' },
        { x: 100, y: 250, width: 150, height: 80, title: 'Component C' },
        { x: 350, y: 250, width: 150, height: 80, title: 'Component D' }
    ];
    
    // Create components
    components.forEach(comp => {
        // Component box
        appendSVGChild(svg, createRect(comp.x, comp.y, comp.width, comp.height, {
            fill: 'white',
            stroke: '#333',
            'stroke-width': '2',
            rx: '5'
        }));
        
        // Component title
        appendSVGChild(svg, createText(comp.x + comp.width / 2, comp.y + comp.height / 2, comp.title, {
            'text-anchor': 'middle',
            'font-family': 'Arial',
            'font-size': '14'
        }));
    });
    
    // Connector lines
    appendSVGChild(svg, createLine(250, 140, 350, 140, {
        stroke: '#333',
        'stroke-width': '2',
        'marker-end': 'url(#arrow)'
    }));
    
    appendSVGChild(svg, createLine(175, 180, 175, 250, {
        stroke: '#333',
        'stroke-width': '2',
        'marker-end': 'url(#arrow)'
    }));
    
    appendSVGChild(svg, createLine(425, 180, 425, 250, {
        stroke: '#333',
        'stroke-width': '2',
        'marker-end': 'url(#arrow)'
    }));
    
    appendSVGChild(svg, createLine(250, 290, 350, 290, {
        stroke: '#333',
        'stroke-width': '2',
        'marker-end': 'url(#arrow)'
    }));
    
    // Arrow marker definition
    const defs = createSVGElement('defs');
    appendSVGChild(svg, defs);
    
    const marker = createSVGElement('marker', {
        id: 'arrow',
        viewBox: '0 0 10 10',
        refX: '9',
        refY: '5',
        markerWidth: '6',
        markerHeight: '6',
        orient: 'auto'
    });
    
    appendSVGChild(defs, marker);
    appendSVGChild(marker, createPath('M 0 0 L 10 5 L 0 10 z', {
        fill: '#333'
    }));
}

// Generate a graph/chart
function generateGraph(svg, width, height) {
    // Background
    appendSVGChild(svg, createRect(0, 0, width, height, {
        fill: 'white',
        stroke: 'none'
    }));
    
    // Title
    appendSVGChild(svg, createText(width / 2, 30, 'Sample Data Chart', {
        'text-anchor': 'middle',
        'font-family': 'Arial',
        'font-size': '18',
        'font-weight': 'bold'
    }));
    
    // Axes
    appendSVGChild(svg, createLine(50, height - 50, width - 50, height - 50, {
        stroke: '#333',
        'stroke-width': '2'
    }));
    
    appendSVGChild(svg, createLine(50, 50, 50, height - 50, {
        stroke: '#333',
        'stroke-width': '2'
    }));
    
    // X-axis label
    appendSVGChild(svg, createText(width / 2, height - 20, 'Categories', {
        'text-anchor': 'middle',
        'font-family': 'Arial',
        'font-size': '14'
    }));
    
    // Y-axis label
    appendSVGChild(svg, createText(20, height / 2, 'Values', {
        'text-anchor': 'middle',
        'font-family': 'Arial',
        'font-size': '14',
        'transform': `rotate(-90 20 ${height / 2})`
    }));
    
    // Sample data
    const data = [
        { label: 'A', value: 150 },
        { label: 'B', value: 220 },
        { label: 'C', value: 80 },
        { label: 'D', value: 190 },
        { label: 'E', value: 120 }
    ];
    
    const maxValue = Math.max(...data.map(d => d.value));
    const barWidth = (width - 100) / data.length / 2;
    const barSpacing = barWidth * 2;
    
    // Create bars and labels
    data.forEach((item, index) => {
        const barHeight = (item.value / maxValue) * (height - 100);
        const x = 50 + barSpacing * index + barWidth;
        const y = height - 50 - barHeight;
        
        // Bar
        appendSVGChild(svg, createRect(x, y, barWidth, barHeight, {
            fill: '#64b5f6',
            stroke: '#1976d2',
            'stroke-width': '1'
        }));
        
        // Label
        appendSVGChild(svg, createText(x + barWidth / 2, height - 35, item.label, {
            'text-anchor': 'middle',
            'font-family': 'Arial',
            'font-size': '12'
        }));
        
        // Value
        appendSVGChild(svg, createText(x + barWidth / 2, y - 10, item.value.toString(), {
            'text-anchor': 'middle',
            'font-family': 'Arial',
            'font-size': '10'
        }));
    });
}

// Create a custom interactive SVG for educational questions
function createInteractiveSVG(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return null;
    
    const defaults = {
        width: 400,
        height: 300,
        type: 'custom',
        title: 'Interactive SVG',
        elements: []
    };
    
    const config = { ...defaults, ...options };
    
    // Create SVG element
    const svg = createSVGElement('svg', {
        viewBox: `0 0 ${config.width} ${config.height}`,
        width: '100%',
        height: 'auto',
        class: 'interactive-svg'
    });
    
    container.appendChild(svg);
    
    // Add title if specified
    if (config.title) {
        const titleElement = createSVGElement('title');
        titleElement.textContent = config.title;
        svg.appendChild(titleElement);
    }
    
    // Add custom elements
    config.elements.forEach(element => {
        let svgElement;
        
        switch(element.type) {
            case 'circle':
                svgElement = createCircle(element.cx, element.cy, element.r, element.attributes);
                break;
            case 'rect':
                svgElement = createRect(element.x, element.y, element.width, element.height, element.attributes);
                break;
            case 'text':
                svgElement = createText(element.x, element.y, element.text, element.attributes);
                break;
            case 'path':
                svgElement = createPath(element.d, element.attributes);
                break;
            case 'line':
                svgElement = createLine(element.x1, element.y1, element.x2, element.y2, element.attributes);
                break;
        }
        
        if (svgElement) {
            svg.appendChild(svgElement);
            
            // Add event handlers if specified
            if (element.events) {
                for (const [event, handler] of Object.entries(element.events)) {
                    svgElement.addEventListener(event, handler);
                }
            }
        }
    });
    
    return svg;
}