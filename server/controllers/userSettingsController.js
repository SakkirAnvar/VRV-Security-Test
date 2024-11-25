import UiSettings from "../models/userSettingsSchema.js";

export const applyNewSettingsChange = async (req, res) => {
    const {
      pagenationLimit,
      chartType,
      dateFormat,
      timeFormat,
      tableHeadBg,
      tableHeadText,
      tableStripped,
      tableHover,
      tableBorder
    } = req.body;
    const { id } = req.params;
  
    try {
      let settings = await UiSettings.findOne({ userId: id });
  
      if (settings) {
        // Update existing settings
        settings.pagenationLimit = pagenationLimit !== undefined ? pagenationLimit : settings.pagenationLimit;
        settings.chartType = chartType !== undefined ? chartType : settings.chartType;
        settings.dateFormat = dateFormat !== undefined ? dateFormat : settings.dateFormat;
        settings.timeFormat = timeFormat !== undefined ? timeFormat : settings.timeFormat;
        settings.tableHeadBg = tableHeadBg !== undefined ? tableHeadBg : settings.tableHeadBg;
        settings.tableHeadText = tableHeadText !== undefined ? tableHeadText : settings.tableHeadText;
        settings.tableStripped = tableStripped !== undefined ? tableStripped : settings.tableStripped;
        settings.tableHover = tableHover !== undefined ? tableHover : settings.tableHover;
        settings.tableBorder = tableBorder !== undefined ? tableBorder : settings.tableBorder;
      } else {
        // Create new settings
        settings = new UiSettings({
          userId: id,
          pagenationLimit,
          chartType,
          dateFormat,
          timeFormat,
          tableHeadBg,
          tableHeadText,
          tableStripped,
          tableHover,
          tableBorder
        });
      }
  
      await settings.save();
      return res.status(200).json({
        message: settings.isNew ? "User settings added" : "User settings has been changed",
        userSettings: settings
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      return res.status(500).json({ message: "An error occurred while updating settings" });
    }
  };

export const getSettings = async(req,res)=>{
    const {id}= req.params;
    const settingsData=await UiSettings.findOne({userId:id})
    if(!settingsData){
        return res.status(404).json({message:"no preset data for the user settings"})
    }
    else{
        return res.status(200).json({message:"user setting data fetched successfully",settingsData:settingsData})
    }
}
