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
        // get the tiles and swatches
        const tiles = this.cfg.grid.querySelectorAll('button');
        const swatches = this.cfg.tiles.querySelectorAll('input');
        const max = swatches.length;
        const cols = this.cols;
        // pick tiles without identical adjacents
        for (let index = 0; index < tiles.length; index += 1) {
			// calculate the coordinates
            let tile = tiles[index];
			let x = index % cols;
			let y = parseInt(index / cols);
            // calculate the indices of the surrounding tiles
            let top = x + (y - 1) * cols;
            let left = (x - 1) + y * cols;
            // pick a non-repeating tile
            let value;
            do {
                let pick = Math.floor(max * Math.random());
                value = swatches[pick].value;
            } while (
                value == tiles[top]?.getAttribute('data-tile') || 
                value == tiles[left]?.getAttribute('data-tile')
            );
            // assign the value to the tile
            tile.setAttribute('data-tile', value);
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
