import Vue from 'vue';
import OverlayScrollbars from 'overlayscrollbars';

class OverlayScrollbarsComponent extends Vue.extend({
    name: 'overlay-scrollbars',
    props: {
        options: {
            type: Object
        },
        extensions: {
            type: [String, Array, Object]
        }
    },
    methods: {
        osInstance() {
            return this._osInstace;
        },
        osTarget() {
            return this.$el || null;
        }
    },
    watch: {
        options(currOptions, oldOptions) {
            let osInstance = this._osInstace;
            if (OverlayScrollbars.valid(osInstance)) {
                osInstance.options(currOptions);
            }
        }
    },
    data() {
        return {};
    },
    mounted() {
        this._osInstace = OverlayScrollbars(this.osTarget(), this.options || {}, this.extensions);
    },
    beforeDestroy() {
        let osInstance = this._osInstace;
        if (OverlayScrollbars.valid(osInstance)) {
            osInstance.destroy();
            this._osInstace = null;
        }
    },
    render(createElement) {
        return (createElement("div", null, this.$slots.default));
    }
}) {
    constructor() {
        super(...arguments);
        this._osInstace = null;
    }
}

const OverlayScrollbarsPlugin = {
    install(vue, options) {
        if (options) {
            OverlayScrollbars.defaultOptions(options);
        }
        vue.component('overlay-scrollbars', OverlayScrollbarsComponent);
    }
};

export { OverlayScrollbarsComponent, OverlayScrollbarsPlugin };
//# sourceMappingURL=overlayscrollbars-vue.esm.js.map
