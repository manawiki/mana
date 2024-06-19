import { Bar } from "react-chartjs-2";

// ====================================
// Chart definitions
// ====================================

export const Histogram = ({ x, y, color, title }: any) => {
   const labels = x;

   const graphdata = {
      labels, // x,
      datasets: [
         {
            data: y,
            backgroundColor: color,
         },
      ],
   };

   const opts = {
      responsive: true,
      plugins: {
         legend: {
            display: false,
         },
         title: {
            display: true,
            text: title,
         },
      },
      scales: {
         y: {
            grid: {
               color: "rgba(150,150,150,0.5)",
            },
         },
         x: {
            grid: {
               tickLength: 2,
               // Only show vertical grid where a showlabel value is
               // color: function (context) {
               //    if (context.tick.label != "") {
               //       return "rgba(150,150,150,0.5)";
               //    } else {
               //       return "rgba(0,0,0,0)"; //transparent
               //    }
               // },
            },
            ticks: {
               // autoSkip: false,
               // For a category axis, only show label if the value matches the "showlabels" array
               // callback: function (val, index) {
               //    // Hide every non-10th tick label
               //    return showlabels.indexOf(this.getLabelForValue(val)) > -1
               //       ? this.getLabelForValue(val)
               //       : "";
               // },
            },
         },
      },
   };

   return <Bar options={opts} data={graphdata} />;
};
