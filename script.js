class MosaicGrid {
    constructor(cfg) {
        // store the elements
        this.cfg = cfg;
        // configure the container's grid properties
        // build the grid
        this.buildGrid();
        // add the action to the columns input
        this.cfg.cols.addEventListener('change', this.buildGrid.bind(this));
        // add the action to the rows input
        this.cfg.rows.addEventListener('change', this.buildGrid.bind(this));
        // add the action to the gap slider
        this.cfg.gap.addEventListener('change', this.updateGrid.bind(this));
        // add the action to the grout colour
        this.cfg.grout.addEventListener('change', this.updateGrid.bind(this));
        // add the action to the randomise button
        this.cfg.shuffle.addEventListener('click', this.generateMosaic.bind(this));
        // redraw the mosaic
    }

    set cols(value) {
        this.cfg.cols.value = value;
    }

    get cols() {
        return +this.cfg.cols.value;
    }

    set rows(value) {
        this.cfg.rows.value = value;
    }

    get rows() {
        return +this.cfg.rows.value;
    }

    set gap(value) {
        this.cfg.gap.value = value;
    }

    get gap() {
        return +this.cfg.gap.value;
    }

    set grout(value) {
        this.cfg.grout.value = value;
    }

    get grout() {
        return this.cfg.grout.value;
    }

    set tile(value) {
        this.cfg.tiles.querySelector(`input[value="${value}"]`).checked = true;
    }

    get tile() {
        return this.cfg.tiles.querySelector('input:checked').value;
    }

    buildGrid() {
        this.cfg.grid.innerHTML = '';
        // calculate the size
        const width = this.cols;
        const height = this.rows;
        const gap = this.gap;
        const total = width * height;
        // configure the grid
        this.cfg.grid.style.cssText = `
            grid-template-columns: repeat(${width}, 1fr);
            grid-template-rows: repeat(${height}, 1fr);
            gap: ${gap}px;
            padding: ${gap}px;
            aspect-ratio: ${width} / ${height};
            background-color: ${this.grout};
        `;
        // create enough tiles for the grid
        for (let index = 0; index < total; index+=1) {
            // calculate the coordinates
            let x = index % width;
            let y = parseInt(index / width);
            // create a grid element
            let element = document.createElement('button');
            element.addEventListener('click', this.paintTile.bind(this, element));
            this.cfg.grid.appendChild(element);
        }
    }

    updateGrid() {
        // update the gap
        this.cfg.grid.style.gap = `${this.gap}px`;
        this.cfg.grid.style.padding = `${this.gap}px`;
        // update the grout colour
        this.cfg.grid.style.backgroundColor = this.grout;
    }

    paintTile(element, evt) {
        // cancel the click
        evt.preventDefault();
        // apply the active tile code
        element.setAttribute('data-tile', this.tile);
    }

    generateMosaic(evt) {
        // cancel the click
        evt.preventDefault();
        // TODO: without adjacent duplicates
        const tiles = this.cfg.grid.querySelectorAll('button');
        const swatches = this.cfg.tiles.querySelectorAll('input');
        for (let tile of tiles) {
            let max = swatches.length;
            let pick = Math.round(max * Math.random() - 0.499);
            let swatch = swatches[pick];
            tile.setAttribute('data-tile', swatch.value);
        }
    }

}

new MosaicGrid({
    'container': document.querySelector('#mosaic-grid'),
    'grid': document.querySelector('#mosaic-grid > figure'),
    'cols': document.querySelector('#mosaic-grid [data-action="cols"]'),
    'rows': document.querySelector('#mosaic-grid [data-action="rows"]'),
    'gap': document.querySelector('#mosaic-grid [data-action="gap"]'),
    'grout': document.querySelector('#mosaic-grid [data-action="grout"]'),
    'tiles': document.querySelector('#mosaic-grid [data-action="tiles"]'),
    'shuffle': document.querySelector('#mosaic-grid [data-action="shuffle"]')
});
