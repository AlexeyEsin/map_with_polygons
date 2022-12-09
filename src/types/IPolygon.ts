interface IPolygon {
  $id: string;
  Id: number;
  Name: string;
  Size: number;
  IsRemoved: boolean;
  SyncId: string;
  Location: {
    Center: number[];
    Polygon: number[][];
  };
  OrganizationId: number;
  SyncDate: string;
}

export default IPolygon;
