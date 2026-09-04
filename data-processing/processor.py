import pandas as pd
import geopandas as gpd

class DatasetProcessor:
    def process_csv(self, file_path):
        """Cleans and validates CSV tabular data before DB ingestion"""
        print(f"Loading '{file_path}' via Pandas...")
        df = pd.read_csv(file_path)
        
        # Validation checks
        if df.isnull().values.any():
            print("Warning: Missing values detected. Imputing...")
            df.fillna(0, inplace=True)
            
        print("CSV processing complete.")
        return df

    def process_geojson(self, file_path):
        """Processes spatial boundaries via GeoPandas"""
        print(f"Loading GeoJSON '{file_path}'...")
        gdf = gpd.read_file(file_path)
        
        if not gdf.crs:
            print("Setting CRS to EPSG:4326")
            gdf.set_crs(epsg=4326, inplace=True)
            
        return gdf

if __name__ == "__main__":
    Processor = DatasetProcessor()
    # Processor.process_csv('../sample_data/Assay_Results.csv')
