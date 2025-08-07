import React from 'react';
import { SvgXml } from 'react-native-svg';
import { Asset } from 'expo-asset';
import { readAsStringAsync } from 'expo-file-system';

const ExpectingMotherSvg = ({ width = 160, height = 180 }) => {
  const [svgContent, setSvgContent] = React.useState(null);

  React.useEffect(() => {
    const loadSvg = async () => {
      try {
        const asset = Asset.fromModule(require('../../assets/illustrations/expecting-mother.svg'));
        await asset.downloadAsync();
        const svgString = await readAsStringAsync(asset.localUri);
        setSvgContent(svgString);
      } catch (error) {
        console.error('Error loading SVG:', error);
      }
    };

    loadSvg();
  }, []);

  if (!svgContent) {
    return null; // or a loading placeholder
  }

  return <SvgXml xml={svgContent} width={width} height={height} />;
};

export default ExpectingMotherSvg;
