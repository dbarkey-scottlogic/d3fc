(function(d3, fc) {
    'use strict';

    fc.series.stackedBar = function() {

        var stackedBar = function(selection) {
            var container;

            selection.each(function(data) {

                // add a 'root' g element on the first enter selection. This ensures
                // that it is just added once
                container = d3.select(this);

                // If the user has already set stacked data then we don't need to re-compute it.
                var layers = stackedBar.stackedData.value;
                if (typeof layers === 'undefined' || layers.length === 0) {
                    layers = stackedBar.layout.value(data);
                }

                var g = fc.utilities.simpleDataJoin(container, 'stacked-bar', layers);

                stackedBar.decorate.value(g);

                var bar = g.selectAll('rect')
                    .data(function(d) { return d; })
                    .enter()
                    .append('rect');

                // Compute the bar width from the x values
                // Assumes first series contains all possible X values.
                var xValues = data[0].map(function(d) { return stackedBar.xScale.value(d.x); });
                var width = stackedBar.barWidth.value(xValues);

                // update
                bar.attr('x', function(d) { return stackedBar.xScale.value(d.x) - width / 2; })
                    .attr('y', function(d) { return stackedBar.yScale.value(d.y + d.y0); })
                    .attr('width', width)
                    .attr('height', function(d) {
                        return stackedBar.yScale.value(d.y0) - stackedBar.yScale.value(d.y + d.y0);
                    });
            });
        };

        stackedBar.decorate = fc.utilities.property(fc.utilities.fn.noop);

        stackedBar.barWidth = fc.utilities.functorProperty(fc.utilities.fractionalBarWidth(0.75));

        stackedBar.xScale = fc.utilities.property(d3.time.scale());

        stackedBar.yScale = fc.utilities.property(d3.scale.linear());

        stackedBar.layout = fc.utilities.property(d3.layout.stack().offset('zero'));

        stackedBar.stackedData = fc.utilities.property([]);

        return stackedBar;
    };
}(d3, fc));
