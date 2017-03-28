fprintf('%s\n', '!!!!! 2016 !!!!');

% Add required libraries
addpath('libs/jsonlab-1.2');

% Define API to communicate
api = 'http://localhost:3000/';
url = [api 'matlab/result'];

% Object with definition of transmission data
% options = weboptions('MediaType', 'application/json', 'CharacterEncoding', 'UTF-8', 'ContentType', 'json', 'RequestMethod', 'post', 'ArrayFormat', 'json');
options = weboptions('MediaType', 'application/json');

% Model name in directory without .mdl extension
model = 'Sikmy_vrh_2';

fprintf('%s%s.\n', 'Load model ', model);
% Load simulation model as master model
load_system(model);

fprintf('%s%s.\n', 'Start simulation of model ', model);

% Run simulation model
set_param(model, 'SimulationCommand', 'Start');

% Create empty arrays for data
timeDataSent = [];
timeDataBefore = [];
vyDataSent = [];
vyDataBefore = [];
xDataSent = [];
xDataBefore = [];
yDataSent = [];
yDataBefore = [];

while 1
   fprintf('%s %s%s\n', 'Reading data from', model, '...');
   
   % Force get data from simulation to matlab workspace
   set_param(model, 'SimulationCommand', 'WriteDataLogs');
   
   % Delete first column - time duplicity
   ScopeDataTime(:,1) = [];
   ScopeDataVY(:,1) = [];
   ScopeDataY(:,1) = [];
   ScopeDataX(:,1) = [];
   
   % C = setdiff(A,B) returns the data in A that is not in B.
   % Stable is key for difference without sorting! http://www.mathworks.com/help/matlab/ref/setdiff.html#btcnv2b-13
   timeDataSent = setdiff(ScopeDataTime, timeDataBefore, 'stable');
   timeDataBefore = ScopeDataTime;
   
   vyDataSent = setdiff(ScopeDataVY, vyDataBefore, 'stable');
   vyDataBefore = ScopeDataVY;
   
   yDataSent = setdiff(ScopeDataY, yDataBefore, 'stable');
   yDataBefore = ScopeDataY;
   
   xDataSent = setdiff(ScopeDataX, xDataBefore, 'stable');
   xDataBefore = ScopeDataX;
   
   % Known final size of array for all types
   n = length(timeDataSent);
   
   % Pre-allocation for faster execution
   timeFinal = zeros(1,n); 
   vyFinal = zeros(1,n);
   yFinal = zeros(1,n);
   xFinal = zeros(1,n);
   
   % Round data to 2 decimal places
   for i=1:n
       % sometimes yDataSent size is lover then size of other arrays
       if (i > size(yDataSent))
           yFinal(i) = 0;
       else
           yFinal(i) = round(yDataSent(i), 2);
       end
       
       timeFinal(i) = round(timeDataSent(i), 2);
       vyFinal(i) = round(vyDataSent(i), 2);
       xFinal(i) = round(xDataSent(i), 2);
   end
   
   % Create json structure using jsonlab library and send to webservice
   json = savejson('result', struct('user', userFromWeb, 'status', 'running', 'data', struct('time', timeFinal, 'vy', vyFinal, 'y', yFinal, 'x',xFinal)));

   response = webwrite(url, json, options);

   % If simulation ends break the while loop
   if strcmp(get_param(model,'SimulationStatus'), 'running') == 0
       fprintf('%s\n', 'End of simulation.');
       json = savejson('result', struct('user', userFromWeb, 'status', 'stopped', 'data', []));
       response = webwrite(url,json,options);
       break
   end

   pause(0.1);
end