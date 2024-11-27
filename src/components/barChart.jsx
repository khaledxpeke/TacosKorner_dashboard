import { ResponsiveBar } from "@nivo/bar";
import { useTheme } from "@emotion/react";
import { tokens } from "../theme";
import React from "react";
import { useResponsive } from "../hooks/uiHook";

const BarChart = React.memo(({data}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isLightMode = theme.palette.mode === "light";
  const { isSmallScreen } = useResponsive();
  return (
    <ResponsiveBar 
      data={data}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
      }}
      keys={["quantity"]}
      indexBy="category"
      margin={isSmallScreen ? { top: 20, right: 20, bottom: 40, left: 50 } : { top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "nivo" }}
      borderRadius={6}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Catégories",
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Quantité",
        legendPosition: "middle",
        legendOffset: -40,
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: "color",
        modifiers: [[isLightMode?"darker":"brighter", 1.6]],
      }}
    />
  );
});

export default BarChart;
