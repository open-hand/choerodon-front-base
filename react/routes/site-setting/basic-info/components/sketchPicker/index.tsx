import React, { useCallback, useState } from 'react';
import { SketchPicker } from 'react-color';
import { DataSet } from '@/interface';

interface IndexProps {
  dataSet: DataSet,
  presetColors: string[],
  themeColor: string,
}

const SketchPickerIndex = ({
  dataSet, presetColors, themeColor,
}: IndexProps) => {
  const [color, setColor] = useState(themeColor);
  const handleColorChange = useCallback(({ hex }) => {
    setColor(hex);
    dataSet.current?.set('themeColor', hex);
  }, [dataSet.current]);

  return (
    <SketchPicker
      width="inherit"
      onChangeComplete={handleColorChange}
      color={color}
      presetColors={presetColors}
    />
  );
};

export default SketchPickerIndex;
