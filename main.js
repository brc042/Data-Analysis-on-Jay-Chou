//global stuff
Array.range = (start, end) => Array.from({length: (end - start)}, (v, k) => k + start);
let keys = ['CM', 'Cm', 'C#M/DbM', 'C#m/Dbm', 'DM', 'Dm', 'EbM', 'Ebm', 'EM', 'Em', 'FM', 'Fm', 'F#M/GbM', 'F#m/Gbm', 'GM', 'Gm', 'AbM', 'Abm', 'AM', 'Am', 'BbM', 'Bbm', 'BM', 'Bm'];
let key_count = [17,  5, 11,  3, 18,  5,  1,  1,  5,  6,  8,  7,  0, 4,  9,  3,  6,  1, 13,  5,  8,  4,  5,  5];
let lyricists = ['方文山', '周杰倫', '黃俊郎', '徐若瑄', '宋健彰', '劉耕宏', '古小立, 黃凌嘉', 'Other 其他'];
let lyricistsCount = [82, 36, 12, 6, 3, 2, 2, 7];
let arrangers = ['林邁可', '黃雨勳', '鍾興民', '洪敬堯', '周杰倫', '蔡科俊', '蔡庭貴'];
let arrangersCount = [43, 34, 29, 20, 17, 6, 1];
let popularityDurationData = [
	[236,49],[241,32],[256,51],[268,32],[276,32],[280,49],[206,42],[302,32],[248,52],[256,37],[234,49],[235,44],[270,53],[158,36],[284,52],[195,45],[225,36],[236,42],[201,44],[334,59],[245,35],[317,49],[268,46],[272,34],[274,33],[252,45],[237,38],[231,51],[238,34],[251,44],[342,47],[218,32],[269,61],[280,43],[315,48],[230,48],[231,32],[232,45],[262,37],[213,34],[291,31],[240,34],[295,55],[256,50],[240,45],[200,35],[236,56],[276,34],[265,32],[251,49],[274,45],[226,54],[284,35],[299,53],[249,50],[245,44],[275,55],[238,47],[232,36],[258,43],[254,57],[242,44],[294,56],[226,46],[263,53],[254,51],[207,37],[260,53],[183,34],[267,46],[270,49],[250,36],[293,50],[166,38],[261,55],[237,56],[220,48],[245,53],[231,33],[286,53],[208,32],[241,47],[235,56],[269,32],[251,52],[172,29],[262,46],[225,30],[254,57],[251,45],[167,29],[309,44],[254,30],[223,55],[191,31],[280,51],[261,47],[236,29],[250,44],[254,45],[166,27],[256,37],[252,45],[252,31],[299,47],[231,27],[230,28],[268,39],[218,33],[224,44],[187,30],[198,29],[161,31],[263,33],[209,27],[156,32],[159,28],[288,34],[183,31],[260,54],[289,44],[252,28],[280,46],[274,49],[205,32],[242,46],[279,45],[175,35],[152,29],[204,30],[289,53],[253,44],[232,37],[158,30],[219,33],[297,50],[221,33],[263,48],[219,39],[279,55],[226,36],[266,43],[221,46],[200,35],[201,32],[290,58],[195,33],[215,64],[174,35],[285,48]
];

//pair x and y together for Highcharts
function to_series(x, y) {
	output = []
	for (i = 0; i < x.length; i++) {
		output.push([x[i], Number(y[i].toFixed(2))]);
	  }
	return output;
};

//re-organize data for Highcharts
function to_pie_data(x, y) {
	total = y.reduce((a, b) => a + b, 0)
	other = 0
	items = []
	output = []

	//pair x and y together for Highcharts in 2D array first
	for (i = 0; i < x.length; i++) {
		if (y[i] < total / 20) {
			other += y[i];
		}
		else {
			items.push([x[i], Math.round(y[i] / total * 100)]);
		}
	}
	items.push(['Other 其他', other]);

	//sort the data
	items.sort(function(first, second) {
		return second[1] - first[1];
	});

	//finalize sorted data to dictionary
	for (i = 0; i < items.length; i++) {
		output.push({name: items[i][0], y: items[i][1]})
	}

	return output;
};

//re-organize data
var keyData = to_series(keys, key_count);
var pieData = to_pie_data(keys, key_count);
var lyricistData = to_series(lyricists, lyricistsCount);
var arrangerData = to_series(arrangers, arrangersCount);

//popularity duration scatter chart
Highcharts.chart({
	title: {
		text: "Jay Chou's Song Duration 周杰倫歌曲長度 vs Spotify Popularity 人氣"
	},
	chart: {
		renderTo: 'popularityDurationChart'
	},
	xAxis: {
		title: {
			text: 'Song Duration 歌曲長度 (s)'
		}
	},
	yAxis: {
		min: 0,
		max: 100,
		title: {
			text: 'Spotify Popularity 人氣'
		}
	},
	series: [{
		type: 'scatter',
		name: 'Song 歌曲',
		data: popularityDurationData
	}, {
		type: 'line',
		name: 'Best Fit Line',
		data: [[150, 30.8008], [350, 54.6872]]
	}],
	credits: {
		enabled: false
	},
});

//key column chart
Highcharts.chart({
	title: {
		text: "Jay Chou's Major/minor Key Usage 周杰倫大小調使用量"
	},
	chart: {
		renderTo: 'keyChart',
		type: 'column'
	},
	xAxis: {
		categories: keys,
		title: {
			text: 'Major/minor Key 大小調'
		}
	},
	yAxis: {
		title: {
			text: 'Count 數量'
		}
	},
	series: [{
		name: 'Major/minor Key 大小調',
		data: keyData
	}],
	credits: {
		enabled: false
	}
});

//key pie chart
Highcharts.chart({
	title: {
		text: "Jay Chou's Major/minor Key Usage 周杰倫大小調使用量"
	},
	chart: {
		renderTo: 'keyPieChart',
		type: 'pie'
	},
	series: [{
		showInLegend: true,
		name: 'Percentage 百分比 (%)',
		data: pieData
	}],
	legend: {
		enabled: true
	},
	credits: {
		enabled: false
	}
});

//lyricist pie chart
Highcharts.chart({
	title: {
		text: "Jay Chou's Lyricists 周杰倫作詞人"
	},
	chart: {
		renderTo: 'lyricistChart',
		type: 'pie'
	},
	series: [{
		showInLegend: true,
		name: 'Lyricist 作詞人',
		data: lyricistData
	}],
	legend: {
		enabled: true
	},
	credits: {
		enabled: false
	}
});

//arranger pie chart
Highcharts.chart({
	title: {
		text: "Jay Chou's Arrangers 周杰倫編曲人"
	},
	chart: {
		renderTo: 'arrangerChart',
		type: 'pie'
	},
	series: [{
		showInLegend: true,
		name: 'Arranger 編曲人',
		data: arrangerData
	}],
	legend: {
		enabled: true
	},
	credits: {
		enabled: false
	}
});
