import React, { useState } from 'react';
import { toVietnamISOString, fromVietnamISOString, formatVietnamTime, getVietnamNow } from '../utils/timezone';

const TimezoneTest = () => {
  const [testTime, setTestTime] = useState('');
  const [result, setResult] = useState('');

  const handleTest = () => {
    if (!testTime) {
      setResult('Vui lòng nhập thời gian');
      return;
    }

    const vietnamISO = toVietnamISOString(testTime);
    const backToLocal = fromVietnamISOString(vietnamISO);
    const formatted = formatVietnamTime(vietnamISO);
    const now = getVietnamNow();

    setResult(`
Input: ${testTime}
Vietnam ISO: ${vietnamISO}
Back to Local: ${backToLocal}
Formatted: ${formatted}
Vietnam Now: ${now.toISOString()}
    `);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Timezone Test</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test Time (datetime-local)
          </label>
          <input
            type="datetime-local"
            className="input"
            value={testTime}
            onChange={(e) => setTestTime(e.target.value)}
          />
        </div>

        <button
          onClick={handleTest}
          className="btn-primary"
        >
          Test Timezone Conversion
        </button>

        {result && (
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium mb-2">Results:</h4>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">{result}</pre>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded">
          <h4 className="font-medium mb-2">Current Time Info:</h4>
          <div className="text-sm space-y-1">
            <div>Browser Local: {new Date().toLocaleString()}</div>
            <div>Vietnam Time: {getVietnamNow().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</div>
            <div>UTC: {new Date().toISOString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimezoneTest;
