# Project 03 – Material Matching – Internal Inventory Records with External Inventory Records

A company has a tracking system for some of their assets, location, and movements. Some asset locations have been shared with external parties for a while. Over time, some of the assets have changed locations, and the information needs to be updated so that both registries match.

There will be the need to arrange some data as government companies provide data in PDF formats.

The task would aim to determine assets in both the external and internal lists. The assets that are not available could come from Spelling problems in external documentation, spaces in different places, equipment that is not standard and that might be inside other equipment, or just the fact that the asset is no longer in the region.

The idea would be to load all the available information in a standardised format into a database where queries can be performed and matches be found. The user could potentially select asset types and check where the most significant discrepancies are found and then dig deeper to determine whether the assets can’t be found due to simple spelling mistakes or because the asset is not in the area. 

After all the discrepancies have been identified, these will be the input for a final report to remove or add the assets from the external records.
Visualisations / Interactions can include and are not limited to:
•	Discrepancies per asset type
•	Discrepancies per State
•	Leaflet map with asset types in Australia
•	API that returns a list of changes to be submitted to the external entities.

The internal database can pull information from around 1000 assets, and external entities per state can have up to 279 assets to compare to. There might be differences in the information available per state, so that will need to be considered.
