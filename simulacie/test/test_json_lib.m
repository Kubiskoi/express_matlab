% clear command window matlab
clc

% add required libraries
addpath('/Users/Erich/Desktop/DP/jsonlab-1.2');

%json=savejson('TimeScope', )
result = '[';
for idx = 1:length(TimeScope)
    %result = [result '{'];
    element = TimeScope(idx);
    result = [result, num2str(element)];
    %result = [result ','];
    if idx ~= length(TimeScope)
        result = [result ',']; 
    end
end
result = [result ']'];


n = length(TimeScope) ; % known final size of array
A = zeros(1,n) ; % pre-allocation
for i=1:n,
   A(i) = TimeScope(i); % a scalar
end


%res = char(result)
%struct('neco',result)
%json=savejson('neco',struct('tags', {{'somename', 'somelongername'}}, 'param1', 1000, 'param2', 'closed'))
json=savejson(A)