import type { ColorPickerProps, GetProp, SelectProps } from 'antd';
import { Button, ColorPicker, Flex, Input, Select, Typography } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useSettings } from 'react-chatbotify';

import { AggregationColor } from 'antd/es/color-picker/color';

const { Text, Title } = Typography;

const options: SelectProps['options'] = [
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Segoe UI', label: 'Segoe UI' },
];
type Color = GetProp<ColorPickerProps, 'value'>;

export const Editor: FC = () => {
  const { updateSettings, settings } = useSettings();
  const [primaryColor, setPrimaryColor] = useState<Color>('#42b0c5');
  const [secondaryColor, setSecondaryColor] = useState<Color>('#491d8d');
  const [fonts, setFont] = useState('');
  const [tooltip, setTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState('Talk to me! 😊');
  useEffect(() => {
    updateSettings({
      general: {
        primaryColor:
          typeof primaryColor === 'string' ? primaryColor : (primaryColor as AggregationColor).toHexString(),
        secondaryColor:
          typeof secondaryColor === 'string' ? secondaryColor : (secondaryColor as AggregationColor).toHexString(),
        fontFamily: fonts,
      },
      tooltip: {
        mode: 'NEVER',
        text: tooltipText,
      },
    });
  }, [primaryColor, secondaryColor, fonts, tooltip, tooltipText]);

  return (
    <>
      <Flex vertical className="mb-4  sm:items-start">
        <Text className="text-sm font-normal mb-1">General</Text>
        <ColorPicker
          className="mb-5 justify-start [&>.ant-color-picker-color-block]:w-12 "
          showText={(color) => <span>Основной цвет</span>}
          value={primaryColor}
          onChange={setPrimaryColor}
        />
        <ColorPicker
          className="justify-start  [&>.ant-color-picker-color-block]:w-12 [&>.ant-color-picker-color-block]:h-7"
          showText={(color) => <span>Вторичный цвет</span>}
          value={secondaryColor}
          onChange={setSecondaryColor}
        />
      </Flex>
      <Select
        allowClear
        rootClassName="w-full sm:max-w-[150px]"
        placeholder="Шрифт"
        onChange={(val: string) => setFont(val)}
        options={options}
        className="mb-4"
      />

      {/* <Space className="mb-4">
        <Switch defaultChecked={tooltip} onChange={setTooltip} />
        <Text>Tooltip</Text>
      </Space> */}
      <Flex vertical className="mb-6">
        <Text className="text-sm font-normal mb-2">Tooltip текст</Text>
        <Input
          className="sm:w-max"
          value={tooltipText}
          onChange={(e) => setTooltipText(e.target.value)}
          placeholder="Tooltip"
        ></Input>
      </Flex>
      <Button className="mx-auto block" type="primary">
        Сохранить настройки
      </Button>
    </>
  );
};
