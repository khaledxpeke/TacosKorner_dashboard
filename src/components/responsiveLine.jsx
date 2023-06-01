import { ResponsiveLine } from '@nivo/line'
const MyResponsiveLine = () => (
    <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: true,
            reverse: false
        }}
        yFormat=" >-.2f"
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'transportation',
            legendOffset: 36,
            legendPosition: 'middle'
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'count',
            legendOffset: -40,
            legendPosition: 'middle'
        }}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
            {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemBackground: 'rgba(0, 0, 0, .03)',
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
    />
)

const data = [
    
        {
          "id": "japan",
          "color": "hsl(260, 70%, 50%)",
          "data": [
            {
              "x": "plane",
              "y": 122
            },
            {
              "x": "helicopter",
              "y": 73
            },
            {
              "x": "boat",
              "y": 257
            },
            {
              "x": "train",
              "y": 15
            },
            {
              "x": "subway",
              "y": 131
            },
            {
              "x": "bus",
              "y": 222
            },
            {
              "x": "car",
              "y": 67
            },
            {
              "x": "moto",
              "y": 215
            },
            {
              "x": "bicycle",
              "y": 232
            },
            {
              "x": "horse",
              "y": 119
            },
            {
              "x": "skateboard",
              "y": 180
            },
            {
              "x": "others",
              "y": 243
            }
          ]
        },
        {
          "id": "france",
          "color": "hsl(256, 70%, 50%)",
          "data": [
            {
              "x": "plane",
              "y": 256
            },
            {
              "x": "helicopter",
              "y": 92
            },
            {
              "x": "boat",
              "y": 111
            },
            {
              "x": "train",
              "y": 56
            },
            {
              "x": "subway",
              "y": 245
            },
            {
              "x": "bus",
              "y": 64
            },
            {
              "x": "car",
              "y": 107
            },
            {
              "x": "moto",
              "y": 30
            },
            {
              "x": "bicycle",
              "y": 83
            },
            {
              "x": "horse",
              "y": 158
            },
            {
              "x": "skateboard",
              "y": 256
            },
            {
              "x": "others",
              "y": 49
            }
          ]
        },
        {
          "id": "us",
          "color": "hsl(232, 70%, 50%)",
          "data": [
            {
              "x": "plane",
              "y": 190
            },
            {
              "x": "helicopter",
              "y": 50
            },
            {
              "x": "boat",
              "y": 197
            },
            {
              "x": "train",
              "y": 54
            },
            {
              "x": "subway",
              "y": 184
            },
            {
              "x": "bus",
              "y": 107
            },
            {
              "x": "car",
              "y": 15
            },
            {
              "x": "moto",
              "y": 10
            },
            {
              "x": "bicycle",
              "y": 145
            },
            {
              "x": "horse",
              "y": 206
            },
            {
              "x": "skateboard",
              "y": 235
            },
            {
              "x": "others",
              "y": 24
            }
          ]
        },
        {
          "id": "germany",
          "color": "hsl(206, 70%, 50%)",
          "data": [
            {
              "x": "plane",
              "y": 48
            },
            {
              "x": "helicopter",
              "y": 75
            },
            {
              "x": "boat",
              "y": 6
            },
            {
              "x": "train",
              "y": 286
            },
            {
              "x": "subway",
              "y": 123
            },
            {
              "x": "bus",
              "y": 293
            },
            {
              "x": "car",
              "y": 264
            },
            {
              "x": "moto",
              "y": 4
            },
            {
              "x": "bicycle",
              "y": 115
            },
            {
              "x": "horse",
              "y": 8
            },
            {
              "x": "skateboard",
              "y": 234
            },
            {
              "x": "others",
              "y": 32
            }
          ]
        },
        {
          "id": "norway",
          "color": "hsl(5, 70%, 50%)",
          "data": [
            {
              "x": "plane",
              "y": 73
            },
            {
              "x": "helicopter",
              "y": 235
            },
            {
              "x": "boat",
              "y": 225
            },
            {
              "x": "train",
              "y": 74
            },
            {
              "x": "subway",
              "y": 39
            },
            {
              "x": "bus",
              "y": 257
            },
            {
              "x": "car",
              "y": 71
            },
            {
              "x": "moto",
              "y": 291
            },
            {
              "x": "bicycle",
              "y": 141
            },
            {
              "x": "horse",
              "y": 277
            },
            {
              "x": "skateboard",
              "y": 16
            },
            {
              "x": "others",
              "y": 82
            }
          ]
        }
      ]

export default MyResponsiveLine;