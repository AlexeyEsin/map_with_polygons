import React, { useEffect, useState } from "react";
import { YMaps, Map, Placemark, Polygon } from "@pbe/react-yandex-maps";
import POLYGONS from "../constants/polygons";
import IPolygon from "../types/IPolygon";
import axios from "axios";

const YandexMap = () => {
  const [polygons, setPolygons] = useState<IPolygon[]>([]);

  const fetchData = async () => {
    // try {
    //   const response = await axios.get("http://agro.energomera.ru:3060/api/field", {
    //     withCredentials: true,
    //     params: {
    //       lastChangeDate: "2022-01-01T10:00:00.000",
    //       skip: 0,
    //       take: 100,
    //     },
    //   });
    //   setPolygons(response.data);
    // } catch (e) {
    //   console.error(e);
    // }

    setPolygons(POLYGONS);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <YMaps>
      <Map
        width="100%"
        height="100%"
        state={{
          type: "yandex#satellite",
          center: polygons[0]?.Location.Center ?? [45, 41],
          zoom: 12,
        }}
      >
        {polygons.map((polygon) => (
          <React.Fragment key={polygon.Id}>
            <Polygon
              geometry={[polygon.Location.Polygon]}
              options={{
                fill: false,
                strokeOpacity: 1,
                strokeWidth: 3,
                strokeColor: "#FFF",
              }}
            />
            <Placemark
              geometry={polygon.Location.Center}
              properties={{
                iconContent: polygon.Id,
              }}
              options={{
                preset: "islands#darkGreenStretchyIcon",
              }}
            />
          </React.Fragment>
        ))}
      </Map>
    </YMaps>
  );
};

export default YandexMap;
